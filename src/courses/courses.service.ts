import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourseDto) {
    try {
      return await this.prisma.course.create({ data });
    } catch (error) {
      this.handleDatabaseError(error);
    }
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
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} was not found`);
    }

    return course;
  }

  async delete(id: number) {
    try {
      return await this.prisma.course.delete({ where: { id } });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async getUsersByCourse(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} was not found`);
    }

    return await this.prisma.userCourse.findMany({
      where: { courseId },
      include: { user: true },
    });
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A course with this value already exists');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Course was not found');
      }
    }

    throw new InternalServerErrorException('Database operation failed');
  }
}