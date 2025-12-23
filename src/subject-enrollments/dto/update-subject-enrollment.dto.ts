import { PartialType } from '@nestjs/swagger';
import { CreateSubjectEnrollmentDto } from './create-subject-enrollment.dto';

export class UpdateSubjectEnrollmentDto extends PartialType(CreateSubjectEnrollmentDto) {}
