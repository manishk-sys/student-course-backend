import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectEnrollmentDto } from './dto/create-subject-enrollment.dto';
import { UpdateSubjectEnrollmentDto } from './dto/update-subject-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model, Types } from 'mongoose';
import { SubjectEnrollment } from 'src/database/schemas/subjectEnrollment.schema';
import { SubjectsService } from 'src/subjects/subjects.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SubjectEnrollmentsService {
  constructor(
    @InjectModel(SubjectEnrollment.name)
    private readonly enrollmentModel: Model<SubjectEnrollment>,
    private readonly subjectService: SubjectsService,
    private readonly userService: UserService,
  ) {}
  async create(createSubjectEnrollmentDto: CreateSubjectEnrollmentDto) {
    await this.subjectService.findOne(createSubjectEnrollmentDto?.subjectId);
    await this.userService.findOne(createSubjectEnrollmentDto?.studentId);

    const exists = await this.enrollmentModel.findOne({
      studentId: createSubjectEnrollmentDto.studentId,
      subjectId: createSubjectEnrollmentDto.subjectId,
    });

    if (exists) {
      throw new ConflictException('Already enrolled');
    }

    return this.enrollmentModel.create({
      ...createSubjectEnrollmentDto,
      studentId: new Types.ObjectId(createSubjectEnrollmentDto.studentId),
      subjectId: new Types.ObjectId(createSubjectEnrollmentDto.subjectId),
      enrolledAt: new Date(),
    });
  }

  async findAll() {
    return await this.enrollmentModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('not a valid mongo object id');
    }

    return await this.enrollmentModel.findById(id);
  }

  async update(
    id: string,
    updateSubjectEnrollmentDto: UpdateSubjectEnrollmentDto,
  ) {
    await this.findOne(id);

    const updatedRecord = await this.enrollmentModel.findByIdAndUpdate(
      id,
      {
        $set: updateSubjectEnrollmentDto,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedRecord) {
      throw new NotFoundException();
    }
    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.enrollmentModel.findByIdAndDelete(id);
  }

  // async enroll(dto: CreateSubjectEnrollmentDto) {
  //   await this.subjectService.findOne(dto?.subjectId);
  //   await this.userService.findOne(dto?.studentId);

  //   const exists = await this.enrollmentModel.findOne({
  //     studentId: dto.studentId,
  //     subjectId: dto.subjectId,
  //   });

  //   if (exists) {
  //     throw new ConflictException('Already enrolled');
  //   }

  //   return this.enrollmentModel.create({
  //     ...dto,
  //     enrolledAt: new Date(),
  //   });
  // }

  async enrolledSubjects(id) {
    await this.userService.findOne(id);

    //this is for all
    //   return await this.enrollmentModel.aggregate([
    //     { $match: { studentId: new Types.ObjectId(id) } },
    //     {
    //       $lookup: {
    //         from: 'users',
    //         localField: 'studentId',
    //         foreignField: '_id',
    //         as: 'students',
    //       },
    //     },
    //     { $unwind: '$students' },
    //     {
    //       $lookup: {
    //         from: 'subjects',
    //         localField: 'subjectId',
    //         foreignField: '_id',
    //         as: 'Subjets',
    //       },
    //     },
    //     { $unwind: '$Subjets' },
    //     {
    //       $addFields: {
    //         both: {
    //           _id: '$students._id',
    //           stuname: '$students.name',
    //           subname:'$Subjets.title'

    //         },
    //       },
    //     },
    //     {
    //       $project: {
    //         'Subjets.title': 1,
    //         'students.email':1,
    //         'both.subname':1
    //       },
    //     },
    //   ]);
    // }

    //this is for subject only simple query
    // return await this.enrollmentModel.aggregate([
    //   { $match: { studentId: new Types.ObjectId(id) } },
    //   {
    //     $lookup: {
    //       from: 'subjects',
    //       localField: 'subjectId',
    //       foreignField: '_id',
    //       as: 'Subjets',
    //     },
    //   },
    //   { $unwind: '$Subjets' },
    //   {
    //     $project: {
    //       'Subjets.title': 1,
    //       'Subjets.credits': 1,
    //       'Subjets._id': 1,
    //       _id: 0,
    //     },
    //   },
    // ]);

    //if you need more optimized then this query is best
    return await this.enrollmentModel.aggregate([
      {
        $match: {
          studentId: new Types.ObjectId(id),
        },
      },

      {
        $lookup: {
          from: 'subjects',
          let: { subjectId: '$subjectId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$subjectId'] },
              },
            },
            {
              $project: {
                title: 1,
                credits: 1,
              },
            },
          ],
          as: 'subject',
        },
      },

      { $unwind: '$subject' },

      {
        $project: {
          subject: 1,
          studentId:1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: '$studentId',
          totalCredits: { $sum: '$subject.credits' },
          subjects: {
            $push: {
              title: '$subject.title',
              credits: '$subject.credits',
            },
          },
        },
      },
    ]);
  }

  async enrolledStudents(id) {
    return await this.enrollmentModel.aggregate([
      {
        $match: {
          subjectId: new Types.ObjectId(id),
        },
      },

      {
        $lookup: {
          from: 'users',
          let: { studentId: '$studentId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$studentId'] },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
              },
            },
          ],
          as: 'student',
        },
      },

      { $unwind: '$student' },

      {
        $project: {
          student: 1,
          _id: 0,
        },
      },
    ]);
  }
}
