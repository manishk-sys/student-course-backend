import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectEnrollmentsService } from './subject-enrollments.service';
import { CreateSubjectEnrollmentDto } from './dto/create-subject-enrollment.dto';
import { UpdateSubjectEnrollmentDto } from './dto/update-subject-enrollment.dto';

@Controller('subject-enrollments')
export class SubjectEnrollmentsController {
  constructor(
    private readonly subjectEnrollmentsService: SubjectEnrollmentsService,
  ) {}

  @Post()
  create(@Body() createSubjectEnrollmentDto: CreateSubjectEnrollmentDto) {
    return this.subjectEnrollmentsService.create(createSubjectEnrollmentDto);
  }

  @Get()
  findAll() {
    return this.subjectEnrollmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectEnrollmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectEnrollmentDto: UpdateSubjectEnrollmentDto,
  ) {
    return this.subjectEnrollmentsService.update(
      id,
      updateSubjectEnrollmentDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectEnrollmentsService.remove(id);
  }

  @Get('students/:id')
  enrolledSubjects(@Param('id') id: string) {
    return this.subjectEnrollmentsService.enrolledSubjects(id);
  }

  @Get('subject/:id')
  enrolledStudents(@Param('id') id: string) {
    return this.subjectEnrollmentsService.enrolledStudents(id);
  }
}
