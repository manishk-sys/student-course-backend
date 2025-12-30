import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './user.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { Course } from 'src/database/schemas/course.schema';
import { CoursesService } from 'src/courses/courses.service';
import { SubjectEnrollment } from 'src/database/schemas/subjectEnrollment.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    // @InjectModel(Course.name) private readonly courseModel: Model<Course>
    private readonly courseService: CoursesService,
    @InjectModel(SubjectEnrollment.name)
    private readonly userSubjectModel: Model<SubjectEnrollment>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create({
      ...createUserDto,
      courses: createUserDto.courses?.map((id) => new Types.ObjectId(id)),
    });
    return user;
  }

  async findAll() {
    // return await this.userModel.find().lean();
    //  return await this.userModel.find().populate('posts').lean();

    // return await this.userModel
    //   .find()
    //   .populate({
    //     path: 'posts',
    //     select: 'title content createdAt', // optional
    //   })
    //   .lean({virtual:true});

    return await this.userModel
      // .find()
      // .populate('posts', 'title content').populate('courses')
      // .lean({ virtuals: true });
      .find()
      .populate('posts', 'title content')
      .populate({
        path: 'courses',
        model: 'Course', // 👈 force model
      }) // 👈 converts IDs → course objects
      .lean({ virtuals: true });

    // return this.userModel.aggregate([
    //   {
    //     $lookup: {
    //       from: 'posts', // collection name (plural!)
    //       localField: '_id',
    //       foreignField: 'author',
    //       as: 'posts',
    //     },
    //   },
    // ]);
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser.toObject();
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  async enrollUser(userId: string, courseId: string) {
    await this.findOne(userId);
    await this.courseService.findOne(courseId);
    // await this.userModel.findByIdAndUpdate(userId, {
    //   $addToSet: { courses: courseId },
    // });

    // await this.courseModel.findByIdAndUpdate(courseId, {
    //   $addToSet: { students: userId },
    // });

    const updatedAssigneduser = await this.userModel.updateOne(
      { _id: userId },
      { $addToSet: { courses: courseId } },
    );

    // await this.userModel.updateOne(
    //   { _id: userId },
    //   {
    //     $addToSet: {
    //       courses: { $each: courseIds }, // for multiple assignment 👈 IMPORTANT
    //     },
    //   },
    // );

    return updatedAssigneduser;
  }

  async deassign(userId: string, courseId: string) {
    // const { userId, courseId } = dto;

    await this.userModel.updateOne(
      { _id: userId },
      { $pull: { courses: courseId } }, // 👈 KEY
    );

    // await this.userModel.updateOne(
    //   { _id: userId },
    //   {
    //     $pull: {
    //       courses: { $in: courseIds }, // multiple de assignment IMPORTANT
    //     },
    //   },
    // );

    return { message: 'Course de-assigned successfully' };
  }

  async dashboard(id: string) {
    return await this.userSubjectModel.aggregate([
      // { $match: { studentId: new Types.ObjectId(id) } },
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
      //     totalenrollment: {
      //       $sum: 1,
      //     },
      //     activeEnrollment: {
      //       $sum: {
      //         $cond: [{ $eq: ['$status', 'Active'] }, 1, 0],
      //       },
      //     },
      //     droppedEnrollment: {
      //       $sum: {
      //         $cond: [{ $eq: ['$status', 'Dropped'] }, 1, 0],
      //       },
      //     },

      //     latestEnrollmentDate: {
      //       $max: '$enrolledAt',
      //     },
      //     subjects: {
      //       $push: {
      //         subject: '$subject',
      //         status: '$status',
      //       },
      //     },
      //   },
      // },

      // { $match: { studentId: new Types.ObjectId(id) } },
      // {
      //   $lookup: {
      //     from: 'subjects',
      //     localField: 'subjectId',
      //     foreignField: '_id',
      //     as: 'subject',
      //   },
      // },
      // { $unwind: '$subject' },
      // // 1️⃣ Group by student + status
      // {
      //   $group: {
      //     _id: {
      //       studentId: '$studentId',
      //       status: { $toLower: '$status' },
      //     },
      //     count: { $sum: 1 },

      //     latestEnrollmentDate: { $max: '$enrolledAt' },

      //     subjects: {
      //       $push: {
      //         subject: '$subject',
      //         status: {$toLower:'$status'},
      //       },
      //     },
      //   },
      // },
      // // 2️⃣ Regroup by student
      // {
      //   $group: {
      //     _id: '$_id.studentId',

      //     totalEnrollment: { $sum: '$count' },

      //     activeEnrollment: {
      //       $sum: {
      //         $cond: [{ $eq: ['$_id.status', 'active'] }, '$count', 0],
      //       },
      //     },

      //     droppedEnrollment: {
      //       $sum: {
      //         $cond: [{ $eq: ['$_id.status', 'dropped'] }, '$count', 0],
      //       },
      //     },

      //     latestEnrollmentDate: { $max: '$latestEnrollmentDate' },

      //     statusSummary: {
      //       $push: {
      //         _id: '$_id.status',
      //         count: '$count',
      //       },
      //     },

      //     subjects: { $push: '$subjects' },
      //   },
      // },
      // // optional: flatten subjects array
      // {
      //   $project: {
      //     totalEnrollment: 1,
      //     activeEnrollment: 1,
      //     droppedEnrollment: 1,
      //     latestEnrollmentDate: 1,
      //     statusSummary: 1,
      //     subjects: {
      //       $reduce: {
      //         input: '$subjects',
      //         initialValue: [],
      //         in: { $concatArrays: ['$$value', '$$this'] },
      //       },
      //     },
      //   },
      // },

      // {
      //   $match: {
      //     studentId: new Types.ObjectId(id),
      //   },
      // },
      // {
      //   $facet: {
      //     // 1️⃣ total enrollments
      //     totalEnrollments: [{ $count: 'count' }],

      //     // 2️⃣ status breakdown
      //     statusSummary: [
      //       {
      //         $group: {
      //           _id: '$status',
      //           count: { $sum: 1 },
      //         },
      //       },
      //     ],

      //     // 3️⃣ subject details
      //     subjects: [
      //       {
      //         $lookup: {
      //           from: 'subjects',
      //           localField: 'subjectId',
      //           foreignField: '_id',
      //           as: 'subject',
      //         },
      //       },
      //       { $unwind: '$subject' },
      //       {
      //         $project: {
      //           _id: 0,
      //           title: '$subject.title',
      //           credits: '$subject.credits',
      //           status: 1,
      //         },
      //       },
      //     ],

      //     // 4️⃣ latest enrollment
      //     latestEnrollment: [
      //       { $sort: { enrolledAt: -1 } },
      //       { $limit: 1 },
      //       { $project: { enrolledAt: 1, _id: 0 } },
      //     ],
      //   },
      // },

      {
        $match: {
          studentId: new Types.ObjectId(id),
        },
      },
      {
        $facet: {
          totalEnrollment: [
            {
              $count: 'count',
            },
          ],
          statusSummary: [
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          subjectsx: [
            {
              $lookup: {
                from: 'subjects',
                localField: 'subjectId',
                foreignField: '_id',
                as: 'Subject',
              },
            },
            { $unwind: '$Subject' },
            {
              $project: {
                _id: 0,
                title: '$Subject.title',
                credits: '$Subject.credits',
              },
            },
          ],
          latestEnroolmentDate: [
            {
              $sort: { enrolledAt: -1 },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                enrolledAt: 1,
              },
            },
          ],
        },
      },

      // 🔥 FIX: convert single-item arrays → objects
      {
        $project: {
          totalEnrollment: {
            $ifNull: [{ $arrayElemAt: ['$totalEnrollment', 0] }, { count: 0 }],
          },

          statusSummary: 1,
          subjectsx: 1,

          latestEnroolmentDate: {
            $arrayElemAt: ['$latestEnroolmentDate', 0],
          },
        },
      },
    ]);
  }
}
