import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post', description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is the content of my post', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: '65a8f3d2c4e7b9a1d1234567',
    description: 'Author user ID',
  })
  @IsMongoId()
  author: string; // MongoDB ObjectId as string
}
