import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { CourseSchema } from './schemas/course.schema';
import { SubjectSchema } from './schemas/subject.schema';
import { SubjectEnrollmentSchema } from './schemas/subjectEnrollment.schema';

@Global() // 🔥 important
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Subject', schema: SubjectSchema },
      { name: 'SubjectEnrollment', schema: SubjectEnrollmentSchema },
    ]),
  ],
  exports: [MongooseModule], // 🔥 allow other modules to use it
})
export class DatabaseModule {}
