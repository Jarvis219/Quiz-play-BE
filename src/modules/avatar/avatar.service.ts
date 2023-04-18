import { AvatarByIdDto, AvatarDto } from '@/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvatarService {
  constructor(private prisma: PrismaService) {}

  async createAvatar({ name, url }: AvatarDto) {
    return this.prisma.avatar.create({
      data: {
        name,
        url,
      },
    });
  }

  async getAllAvatars() {
    return this.prisma.avatar.findMany();
  }

  async getAvatarById({ id }: AvatarByIdDto) {
    return this.prisma.avatar.findUnique({
      where: {
        id,
      },
    });
  }

  async getAvatarByName({ name }: { name: string }) {
    return this.prisma.avatar.findUnique({
      where: {
        name,
      },
    });
  }

  async updateAvatar({ id, name, url }: AvatarDto) {
    return this.prisma.avatar.update({
      where: {
        id,
      },
      data: {
        name,
        url,
      },
    });
  }

  async deleteAvatar({ id }: AvatarByIdDto) {
    return this.prisma.avatar.delete({
      where: {
        id,
      },
    });
  }
}
