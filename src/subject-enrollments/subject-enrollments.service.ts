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
      enrolledAt: createSubjectEnrollmentDto?.enrolledAt ?? new Date(),
    });
  }

  async findAll({ page, limit, raw }) {
    if (raw == true) {
      console.log(
        'rawrawrawraw-------------------------------------------------',
        raw,
      );
      return await this.enrollmentModel.find();
    } else {
      return await this.enrollmentModel.aggregate([
        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'subject',
        //   },
        // },
        // { $unwind: '$subject' },
        // {
        //   $group: {
        //     _id: '$studentId',
        //     totalSubjects: {
        //       $sum: 1,
        //     },
        //     totalCreditsOfAllSubjects: {
        //       $sum: '$subject.credits',
        //     },
        //   },
        // },

        // {
        //   $group:{
        //     _id:'$studentId',
        //     subjectIds:{
        //       $push:'$subjectId'
        //     }
        //   }
        // }

        // {
        //   $group:{
        //     _id:'$studentId',
        //     uniqueSubjects:{
        //       $addToSet:'$subjectId'
        //     }
        //   }
        // }

        // { $match: { status: 'active' } },
        // {
        //   $group: {
        //     _id: '$studentId',
        //     activeSubjects: {
        //       $push: '$subjectId',
        //     },
        //   },
        // },

        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'Subject',
        //   },
        // },
        // {
        //   $unwind: '$Subject',
        // },

        // {
        //   $sort: { enrolledAt: 1 },
        // },
        // {
        //   $group: {
        //     _id: '$studentId',

        //     firstEnrollment: {
        //       $first: {
        //         enrolledAt: '$enrolledAt',
        //         subject: '$Subject',
        //       },
        //     },

        //     lastEnrollment: {
        //       $last: {
        //         enrolledAt: '$enrolledAt',
        //         subject: '$Subject',
        //       },
        //     },
        //   },
        // },

        // {
        //   $group:{
        //     _id:null,
        //     totalEnrollment:{
        //       $sum:1
        //     },
        //     uniqueStudents:{
        //       $addToSet:'$studentId'
        //     },
        //     uniqueSubjects:{
        //       $addToSet:'$subjectId'
        //     }
        //   }
        // }

        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'Subject',
        //   },
        // },
        // { $unwind: '$Subject' },
        // {
        //   $project: {
        //     _id: 1,
        //     studentId: 1,
        //     'Subject.title': 1,
        //     'Subject.credits': 1,
        //   },
        // },

        // {
        //   $group: {
        //     _id: '$studentId',
        //     subjects: {
        //       $addToSet: '$Subject',
        //     },
        //   },
        // },

        // {
        //   $group: {
        //     _id: '$studentId',
        //     activeEnrollment: {
        //       $sum: {
        //         $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
        //       },
        //     },
        //     droppedEnrollment: {
        //       $sum: {
        //         $cond: [{ $eq: ['$status', 'dropped'] }, 1, 0],
        //       },
        //     },
        //   },
        // },

        // {
        //   $group: {
        //     _id: {
        //       studentId: '$studentId',
        //       status: '$status',
        //     },
        //     count: { $sum: 1 },
        //   },
        // },
        // {
        //   $group: {
        //     _id: '$_id.studentId',
        //     counts: {
        //       $push: {
        //         status: '$_id.status',
        //         count: '$count',
        //       },
        //     },
        //   },
        // },

        // {
        //   $group:{
        //     _id:'$studentId',
        //     totalSubjectEnrolled:{
        //       $sum:1
        //     }
        //   }
        // },
        // {
        //   $match:{totalSubjectEnrolled:{$gt:1}}
        // }

        // {
        //   $group: {
        //     _id: '$enrolledAt',
        //     totalEnrolled: {
        //       $sum: 1,
        //     }
        //   },
        // },
        // {
        //   $project:{
        //     _id:0,
        //     enrolledAt:'$_id',
        //     totalEnrolled:1
        //   }
        // }

        // {
        //   $group: {
        //     _id: {
        //       studentId: '$studentId',
        //       enrolledDate: '$enrolledAt',
        //     },
        //     count: {
        //       $sum: 1,
        //     },
        //   },
        // },
        // {
        //   $group: {
        //     _id: '$_id.studentId',
        //     isRepeat: {
        //       $max: {
        //         $cond: [{ $gt: ['$count', 1] }, true, false],
        //       },
        //     },
        //     enrollDate: {
        //       // $push:'$_id.enrolledDate'
        //       $push: {
        //         $cond: [
        //           { $gt: ['$count', 1] },
        //           '$_id.enrolledDate',
        //           '$$REMOVE',
        //         ],
        //       },
        //     },
        //   },
        // },

        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'subject',
        //   },
        // },
        // { $unwind: '$subject' },
        // {
        //   $group: {
        //     _id: '$studentId',
        //     subjects: {
        //       $addToSet: '$subject.title',
        //     },
        //   },
        // },
        // {
        //   $addFields: {
        //     totalSubject: { $size: '$subjects' },
        //   },
        // },

        // {
        //   $lookup: {
        //     from: 'users',
        //     localField: 'studentId',
        //     foreignField: '_id',
        //     as: 'Student',
        //   },
        // },
        // { $unwind: '$Student' },
        // {
        //   $group: {
        //     _id: '$studentId',
        //     enrollCount: {
        //       $sum: 1,
        //     },
        //     student:{
        //       $first:'$Student'
        //     }
        //   },
        // },
        // {
        //   $sort: {
        //     enrollCount: -1,
        //   },
        // },

        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'Subject',
        //   },
        // },
        // { $unwind: '$Subject' },
        // {
        //   $group: {
        //     _id: '$subjectId',
        //     totalStudent: {
        //       $sum: 1,
        //     },
        //     subject: {
        //       $first: '$Subject',
        //     },
        //   },
        // },
        // {
        //   $sort: {
        //     totalStudent: -1,
        //   },
        // },
        // {
        //   $limit: 1,
        // },

        // {
        //   $group: {
        //     _id: '$subjectId',
        //     totalStudent: { $sum: 1 },
        //   },
        // },
        // {
        //   $sort: { totalStudent: -1 },
        // },
        // {
        //   $limit: 1,
        // },
        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: '_id', // 👈 use _id
        //     foreignField: '_id',
        //     as: 'subject',
        //   },
        // },
        // { $unwind: '$subject' },

        // {
        //   $sortByCount: '$subjectId',
        // },
        // {
        //   $limit: 1,
        // },
        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: '_id',
        //     foreignField: '_id',
        //     as: 'subject',
        //   },
        // },
        // { $unwind: '$subject' },

        // {
        //   $sortByCount: '$studentId',
        // },

        // {
        //   $group: {
        //     _id: '$subjectId',
        //     totalStudent: { $sum: 1 },
        //   },
        // },
        // {
        //   $group: {
        //     _id: null,
        //     maxCount: { $max: '$totalStudent' },
        //     subjects: { $push: '$$ROOT' },
        //   },
        // },
        // {
        //   $unwind: '$subjects',
        // },
        // {
        //   $match: {
        //     $expr: { $eq: ['$subjects.totalStudent', '$maxCount'] },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjects._id',
        //     foreignField: '_id',
        //     as: 'subject',
        //   },
        // },
        // { $unwind: '$subject' },

        // {
        //   $group: {
        //     _id: '$subjectId',
        //     totalStudents: {
        //       $sum: 1,
        //     },
        //   },
        // },
        // {
        //   $group:{
        //     _id:null,
        //     maxi:{
        //       $sum:'$totalStudents'
        //     },
        //     studentsz:{
        //       $push:'$$ROOT'
        //     }
        //   }
        // }

        // {
        //   $group: {
        //     _id: {
        //       studentId: '$studentId',
        //       subjectId: '$subjectId',
        //     },

        //     count:{
        //       $sum:1
        //     }
        //   },
        // },
        // {
        //   $match:{
        //     count:{
        //       $gt:1
        //     }
        //   }
        // }

        // {
        //   $group: {
        //     _id: '$studentId',
        //     timeline: {
        //       $push: {
        //         subjectId: '$subjectId',
        //         date: '$enrolledAt',
        //       },
        //     },
        //   },
        // },

        // {
        //   $lookup: {
        //     from: 'users',
        //     localField: 'studentId',
        //     foreignField: '_id',
        //     as: 'StudentInfo',
        //   },
        // },
        // { $unwind: '$StudentInfo' },
        // {
        //   $lookup: {
        //     from: 'subjects',
        //     localField: 'subjectId',
        //     foreignField: '_id',
        //     as: 'Subject',
        //   },
        // },
        // { $unwind: '$Subject' },
        // {
        //   $group: {
        //     _id: '$studentId',
        //     UniqueSubjects: {
        //       $addToSet: '$Subject',
        //     },
        //     totalSubject: {
        //       $sum: 1,
        //     },
        //     totalCredits: {
        //       $sum: '$Subject.credits',
        //     },
        //     firstEnrollment: {
        //       $min: '$enrolledAt',
        //     },
        //     lastEnrollment: {
        //       $max: '$enrolledAt',
        //     },
        //   },
        // },

        // {
        //   $setWindowFields: {
        //     partitionBy: '$studentId',
        //     sortBy: { enrolledAt: 1 },
        //     output: {
        //       runningCount: { $count: {} },
        //     },
        //   },
        // },

        // {
        //   $bucket: {
        //     groupBy: '$enrolledAt',
        //     boundaries: [
        //       new Date('2025-12-23T00:00:00Z'),
        //       new Date('2025-12-24T00:00:00Z'),
        //       new Date('2025-12-25T00:00:00Z'),
        //     ],
        //     default: 'After 24 Dec',
        //     output: {
        //       totalEnrollments: { $sum: 1 },
        //       students: { $addToSet: '$studentId' },
        //     },
        //   },
        // },

        // {
        //   $bucketAuto: {
        //     groupBy: '$enrolledAt',
        //     buckets: 3,
        //     output: {
        //       totalEnrollments: { $sum: 1 },
        //       uniqueStudents: { $addToSet: '$studentId' },
        //     },
        //   },
        // },

        // {
        //   $group: {
        //     _id: '$studentId',
        //     enrollmentCount: { $sum: 1 },
        //   },
        // },
        // {
        //   $bucketAuto: {
        //     groupBy: '$enrollmentCount',
        //     buckets: 4,
        //     output: {
        //       students: { $sum: 1 },
        //     },
        //   },
        // },
        // {
        //   $bucket:{
        //     groupBy:'$enrollmentCount',
        //     boundaries:[1,2,3],
        //     default:'after 2 count',
        //     output:{
        //       student:{$sum:1},

        //     }
        //   }
        // }
      ]);
    }
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
          studentId: 1,
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
