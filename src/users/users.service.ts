import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create a new user
  // async create(createUserDto: CreateUserDto) {
  //   return await this.prisma.user.create({
  //     data: createUserDto,
  //   });
  // }

  async create(createUserDto: CreateUserDto) {
  const { profile, posts, ...userData } = createUserDto;

  return await this.prisma.user.create({
    data: {
      ...userData,

      profile: profile
        ? {
            create: profile,
          }
        : undefined,
      posts: posts
        ? {
            create: posts,
          }
        : undefined,
    },
    include: {
      profile: true,
      posts: true,
    },
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

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Update a user
  // async update(id: number, data: UpdateUserDto) {
  //   return await this.prisma.user.update({
  //     where: { id },
  //     data,
  //   });
  // }


  // Update a user
async update(id: number, data: UpdateUserDto) {
  const { profile, posts, ...userData } = data;

  return await this.prisma.user.update({
    where: { id },
    data: {
      ...userData,

      profile: profile
        ? {
            upsert: {
              create: profile,
              update: profile,
            },
          }
        : undefined,
      posts: posts
        ? {
            create: posts,
          }
        : undefined,
    },
    include: {
      profile: true,
      posts: true,
    },
  });
}

  // Delete a user
  async delete(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async enrollInCourse(userId: number, courseId: number) {
  return await this.prisma.userCourse.create({
    data: {
      userId,
      courseId,
    },
    include: {
      user: true,
      course: true,
    },
  });
}

async getUserCourses(userId: number) {
  return await this.prisma.userCourse.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
  });
}
}
