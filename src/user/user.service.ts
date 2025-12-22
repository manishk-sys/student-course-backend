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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
}
