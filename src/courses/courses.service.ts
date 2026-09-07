import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    return await this.prisma.course.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.course.delete({
      where: { id },
    });
  }

  async getUsersByCourse(courseId: number) {
  return await this.prisma.userCourse.findMany({
    where: {
      courseId,
    },
    include: {
      user: true,
    },
  });
}
}