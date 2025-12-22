import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'MongoDB Basics',
    description: 'Title of the course',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Learn MongoDB from scratch',
    description: 'Course description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
