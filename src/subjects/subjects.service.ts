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

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private readonly subjectModel: Model<Subject>,
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
}
