import { Injectable } from '@nestjs/common';
import { UpdateProfileDto, UserDto } from 'src/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findUserByCondition(condition: any) {
    return await this.prisma.user.findFirst({ where: condition });
  }

  async update(id: number, data: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
