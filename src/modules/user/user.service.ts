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

  async getByVerifyEmailToken(token: string) {
    return this.prisma.user.findFirst({
      where: { verify_email_token: token },
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

  async updateVerifyAcount(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { is_verified: true, verify_email_token: null },
    });
  }

  async getByForgotPasswordToken({ token }: { token: string }) {
    return this.prisma.user.findFirst({
      where: { reset_password_token: token },
    });
  }

  async updateForgotPasswordToken({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) {
    return this.prisma.user.update({
      where: { email },
      data: { reset_password_token: token },
    });
  }

  async updatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    return this.prisma.user.update({
      where: { email },
      data: { reset_password_token: null, password },
    });
  }
}
