import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { CourseSchema } from './schemas/course.schema';

@Global() // 🔥 important
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Course', schema: CourseSchema },
    ]),
  ],
  exports: [MongooseModule], // 🔥 allow other modules to use it
})
export class DatabaseModule {}
