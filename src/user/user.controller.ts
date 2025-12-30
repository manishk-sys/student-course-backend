import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EnrollCourseDto } from './dto/enroll-course.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('enrollment')
  enrollment(@Body() enrollmentDto: EnrollCourseDto) {
    return this.userService.enrollUser(
      enrollmentDto?.userId,
      enrollmentDto?.courseId,
    );
  }

  @Put('unenrollment')
  unenrollment(@Body() enrollmentDto: EnrollCourseDto) {
    return this.userService.deassign(
      enrollmentDto?.userId,
      enrollmentDto?.courseId,
    );
  }

  @Get('dashboard/student/:id')
  dashboard(@Param('id') id: string) {
    return this.userService.dashboard(id);
  }
}
