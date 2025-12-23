import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class EnrollCourseDto {
  @ApiProperty({
    description: 'User ID to be enrolled',
    example: '65fd9e9f2c2b9a0f12a11111',
  })
  @IsMongoId()
  userId: string;

  @ApiProperty({
    description: 'Course ID to enroll into',
    example: '65fd9e9f2c2b9a0f12a22222',
  })
  @IsMongoId()
  courseId: string;
}
