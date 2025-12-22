import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/database/schemas/post.schema';
import { isValidObjectId, Model, Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    return await this.postModel.create({
      ...createPostDto,
      author: new Types.ObjectId(createPostDto.author),
    });
  }

  async findAll() {
    // return await this.postModel.find().lean();
    return this.postModel
      .find()
      .populate('author', 'name email age') // ✅ populate author field
      .lean();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post Id');
    }

    const post = await this.postModel.findById(id).lean();

    if (!post) {
      throw new NotFoundException('Post not Found');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post Id');
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updatePostDto,
          author: new Types.ObjectId(updatePostDto.author),
        },
      },
      { new: true, runValidators: true },
    );
    if (!updatedPost) {
      throw new NotFoundException('Post not Found');
    }

    return updatedPost;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Post Id');
    }

    const deletedRecord = await this.postModel.findByIdAndDelete(id);
    if (!deletedRecord) {
      throw new NotFoundException('Post not Found');
    }

    return deletedRecord;
  }
}
