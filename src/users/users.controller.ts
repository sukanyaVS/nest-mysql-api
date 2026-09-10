import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
  @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  // Get all users
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  // Get a single user by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  // Update a user
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  // Delete a user
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }

  @Post(':userId/courses/:courseId')
enrollInCourse(
  @Param('userId', ParseIntPipe) userId: number,
  @Param('courseId', ParseIntPipe) courseId: number,
) {
  return this.usersService.enrollInCourse(userId, courseId);
}

@Get(':id/courses')
getUserCourses(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.getUserCourses(id);
}
}
