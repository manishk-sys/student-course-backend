import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'title of subject',
    example: 'Maths',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Credits of Subject',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  credits: number;
}
