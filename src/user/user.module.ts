import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from 'src/courses/courses.service';
// import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService,CoursesService],
})
export class UserModule {}
