import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  // Get all users
  async findAll() {
    return await this.prisma.user.findMany();
  }

  // Get a single user by ID
  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Update a user
  async update(id: number, data: { name?: string; email?: string; age?: number }) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete a user
  async delete(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
