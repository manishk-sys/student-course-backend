import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from 'src/database/schemas/subject.schema';
import { isValidObjectId, Model } from 'mongoose';
import { SubjectEnrollment } from 'src/database/schemas/subjectEnrollment.schema';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
    @InjectModel(SubjectEnrollment.name)
    private readonly userSubjectModel: Model<SubjectEnrollment>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjectModel.create(createSubjectDto);
  }

  async findAll() {
    return await this.subjectModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid given id');
    }

    const subject = await this.subjectModel.findById(id);

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id);

    const updatedRecord = await this.subjectModel.findByIdAndUpdate(
      id,
      {
        $set: updateSubjectDto,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.subjectModel.findByIdAndDelete(id);
  }

  async stats() {
    return await this.userSubjectModel.aggregate([
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
        $facet: {
          subjectStats: [
            {
              $group: {
                _id: '$subjectId',
                totalstudent: {
                  $sum: 1,
                },
                active: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'Active'] }, 1, 0],
                  },
                },
                dropped: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'Dropped'] }, 1, 0],
                  },
                },
              },
            },
          ],

          studentStats: [
            // {
            //   $lookup: {
            //     from: 'subjects',
            //     localField: 'subjectId',
            //     foreignField: '_id',
            //     as: 'Subject',
            //   },
            // },
            // { $unwind: '$Subject' },
            {
              $group: {
                _id: '$studentId',
                totalSubject: {
                  $sum: 1,
                },
                subjects: {
                  $push: '$Subject',
                },
              },
            },
          ],

          totalAllSubject: [
            { $group: { _id: '$subjectId' } },
            {
              $count: 'totalSubject',
            },
          ],
          totalAllStudent: [
            { $group: { _id: '$studentId' } },
            {
              $count: 'totalstudent',
            },
          ],
          perDayStats: [
            {
              $group: {
                _id: '$enrolledAt',
                count: {
                  $sum: 1,
                },
                activeperDayEnrollment: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'Active'] }, 1, 0],
                  },
                },
                droppedPerDayEnrollment: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'Dropped'] }, 1, 0],
                  },
                },
              },
            },
            { $sort: { _id: 1 } },
            // {
            //   $group: {
            //     _id: null,
            //     data: { $push: '$$ROOT' },
            //     total: { $sum: '$count' },
            //   },
            // },

            {
              $setWindowFields: {
                sortBy: { _id: 1 },
                output: {
                  cumulativeEnrollment: {
                    $sum: '$count',
                    window: { documents: ['unbounded', 'current'] },
                  },
                },
              },
            },
          ],

          statusSummary: [
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
                subjectsIds: {
                  $addToSet: '$subjectId',
                },
                studentIds: {
                  $addToSet: '$studentId',
                },
              },
            },
            {
              $group: {
                _id: null,
                data: {
                  $push: '$$ROOT',
                },

                total: {
                  $sum: '$count',
                },
                active: {
                  $sum: {
                    $cond: [{ $eq: ['$_id', 'active'] }, '$count', 0],
                  },
                },
                dropped: {
                  $sum: {
                    $cond: [{ $eq: ['$_id', 'dropped'] }, '$count', 0],
                  },
                },
              },
            },
            // {
            //   $addFields: {
            //     meta: {
            //       active: {
            //          $sum: '$count',
            //       },
            //       dropped: '$count',
            //     },
            //   },
            // },
          ],

          withBucket: [
            {
              $bucket: {
                groupBy: '$enrolledAt',
                boundaries: [
                  new Date('2025-12-22T00:00:00.000Z'),
                  new Date('2025-12-24T00:00:00.000Z'),
                  new Date('2025-12-25T00:00:00.000Z'),
                  new Date('2025-12-26T00:00:00.000Z'), // closes last bucket
                ],
                default: '25 plus +',
                output: {
                  count: { $sum: 1 },
                  // records:{
                  //   $push:"$$ROOT"
                  // }
                },
              },
            },
          ],

          withWindowField: [
            // {
            //   $setWindowFields: {
            //     sortBy: { enrolledAt: 1 },
            //     output: {
            //       runningEnrollments: {
            //         $count: {},
            //         window: { documents: ['unbounded', 'current'] },
            //       },
            //     },
            //   },
            // },
            // {
            //   $project:{
            //     studentId:1,
            //     runningEnrollments:1,
            //     subjectId:1,
            //     enrolledAt:1
            //   }
            // }

            // {
            //   $setWindowFields: {
            //     partitionBy: '$studentId',
            //     sortBy: { enrolledAt: 1 },
            //     output: {
            //       studentRunningEnrollments: {
            //         $count: {},
            //         window: {
            //           documents: ['unbounded', 'current'],
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            //   $project: {
            //     studentId: 1,
            //     subjectId: 1,
            //     enrolledAt: 1,
            //     studentRunningEnrollments: 1,
            //     _id: 0,
            //   },
            // },

            // {
            //   $setWindowFields: {
            //     partitionBy: '$studentId',
            //     sortBy: { enrolledAt: 1 },
            //     output: {
            //       previousEnrollmentDate: {
            //         $shift: {
            //           output: '$enrolledAt',
            //           by: -1,
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            //   $addFields: {
            //     gapInDays: {
            //       $cond: [
            //         { $gt: ['$previousEnrollment', null] },
            //         {
            //           $dateDiff: {
            //             startDate: '$previousEnrollment',
            //             endDate: '$enrolledAt',
            //             unit: 'day',
            //           },
            //         },
            //         null,
            //       ],
            //     },
            //   },
            // },
            // {
            //   $project: {
            //     studentId: 1,
            //     enrolledAt: 1,
            //     gapInDays:1,
            //     previousEnrollmentDate: 1,
            //     _id: 0,
            //   },
            // },

            {
              $group: {
                _id: '$studentId',
                totalEnrollments: { $sum: 1 },
              },
            },
            {
              $setWindowFields: {
                sortBy: { totalEnrollments: -1 },
                output: {
                  rank: {
                    $denseRank: {},
                  },
                },
              },
            },
            {
              $project: {
                studentId: '$_id',
                totalEnrollments: 1,
                rank: 1,
                _id: 0,
              },
            },
          ],
        },
      },

      {
        $project: {
          studentStats: 1,
          subjectStats: 1,
          perDayStats: 1,
          statusSummary: 1,
          withBucket: 1,
          withWindowField: 1,
          totalAllStudent: {
            $arrayElemAt: ['$totalAllStudent', 0],
          },
          totalAllSubject: {
            $arrayElemAt: ['$totalAllSubject', 0],
          },
        },
      },
    ]);
  }
}
