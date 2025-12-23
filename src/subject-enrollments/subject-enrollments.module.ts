import { Module } from '@nestjs/common';
import { SubjectEnrollmentsService } from './subject-enrollments.service';
import { SubjectEnrollmentsController } from './subject-enrollments.controller';
import { SubjectsService } from 'src/subjects/subjects.service';
import { UserService } from 'src/user/user.service';
import { CoursesService } from 'src/courses/courses.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  controllers: [SubjectEnrollmentsController],
  providers: [SubjectEnrollmentsService,SubjectsService,
    // UserService,CoursesService
  
  ],
})
export class SubjectEnrollmentsModule {}
