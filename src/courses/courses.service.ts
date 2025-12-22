import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Course } from 'src/database/schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course?.name) private readonly courseModel: Model<Course>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    return await this.courseModel.create(createCourseDto);
  }

  async findAll() {
    return await this.courseModel.find().populate('students','name email');
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Id');
    }

    const course = await this.courseModel.findById(id).populate('students','name email');

    if (!course) {
      throw new NotFoundException('Record does not exist');
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOne(id);
    const updated = await this.courseModel.findByIdAndUpdate(
      id,
      { $set: { ...updateCourseDto } },
      { new: true, runValidators: true },
    );

    return updated?.toObject();
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.courseModel.findByIdAndDelete(id);
  }
}
