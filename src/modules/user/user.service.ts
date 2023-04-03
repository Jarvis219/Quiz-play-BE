import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/common';
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

  // async updateAvatar(params: {}) {}

  // async user({ email }: UserDto): Promise<UserDto | null> {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }

  // async users(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.UserWhereUniqueInput;
  //   where?: Prisma.UserWhereInput;
  //   orderBy?: Prisma.UserOrderByWithRelationInput;
  // }): Promise<UserDto[]> {
  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.user.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }

  // async createUser(data: Prisma.UserCreateInput): Promise<UserDto> {
  //   return this.prisma.user.create({
  //     data,
  //   });
  // }

  // async updateUser(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUpdateInput;
  // }): Promise<UserDto> {
  //   const { where, data } = params;
  //   return this.prisma.user.update({
  //     data,
  //     where,
  //   });
  // }

  // async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserDto> {
  //   const email = where.email;
  //   return this.prisma.user.delete({
  //     where: { email },
  //   });
  // }
}
