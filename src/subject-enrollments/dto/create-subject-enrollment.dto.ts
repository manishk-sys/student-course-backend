import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class CreateSubjectEnrollmentDto {
  @ApiProperty({
    description: 'MongoDB ID of the student',
    example: '64f1c9a2b9a1c2d3e4f56789',
  })
  @IsMongoId()
  studentId: string;

  @ApiProperty({
    description: 'MongoDB ID of the subject',
    example: '64f1c9b3a1b2c3d4e5f67890',
  })
  @IsMongoId()
  subjectId: string;

  @ApiProperty({
    description: 'Enrollment date',
    example: '2025-01-15T10:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  enrolledAt?: Date;
}
