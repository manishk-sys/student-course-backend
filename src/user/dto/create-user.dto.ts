import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProfileDto {
  @ApiPropertyOptional({
    example: 25,
    description: 'Age of the user',
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({
    example: 'Backend Developer',
    description: 'Short bio of the user',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'Delhi, India',
    description: 'Address of the user',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '9999999999',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Manish Kumar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'manish@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsInt()
  @Min(18)
  age?: number;

  @ApiPropertyOptional({
    type: CreateProfileDto,
    description: 'Embedded user profile',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;

  @ApiPropertyOptional({
    example: ['65fd9e9f2c2b9a0f12a12345'],
    description: 'Course IDs the user is enrolled in',
    type: [String],
  })
  @IsOptional()
  @IsMongoId({ each: true })
  courses?: string[];
}
