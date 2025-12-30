import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectEnrollmentsService } from './subject-enrollments.service';
import { CreateSubjectEnrollmentDto } from './dto/create-subject-enrollment.dto';
import { UpdateSubjectEnrollmentDto } from './dto/update-subject-enrollment.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('subject-enrollments')
export class SubjectEnrollmentsController {
  constructor(
    private readonly subjectEnrollmentsService: SubjectEnrollmentsService,
  ) {}

  @Post()
  create(@Body() createSubjectEnrollmentDto: CreateSubjectEnrollmentDto) {
    return this.subjectEnrollmentsService.create(createSubjectEnrollmentDto);
  }

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'raw', required: false, type: Boolean })
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('raw') raw?: boolean,
  ) {
    return this.subjectEnrollmentsService.findAll({ page, limit, raw });
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
