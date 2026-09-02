import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  async create(
    @Body() body: { name: string; email: string; age?: number },
  ) {
    return await this.usersService.create(body);
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
    @Body() body: { name?: string; email?: string; age?: number },
  ) {
    return await this.usersService.update(id, body);
  }

  // Delete a user
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }
}
