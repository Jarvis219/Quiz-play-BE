import {
  AvatarByIdDto,
  AvatarDto,
  DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
  UpdateAvatarDto,
  multerImageFilter,
} from '@/common';
import { formatName } from '@/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { FirebaseStorageService } from 'src/services';
import { AvatarService } from './avatar.service';

@ApiTags('avatar')
@UseGuards(AuthGuard('jwt'))
@Controller('avatar')
export class AvatarController {
  constructor(
    private readonly avartarService: AvatarService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @Get('')
  async getAllAvatars() {
    return this.avartarService.getAllAvatars();
  }

  @Get(':id')
  async getAvatarById(@Param() params: AvatarByIdDto) {
    try {
      return this.avartarService.getAvatarById({ id: params.id });
    } catch (error) {
      throw new NotFoundException('Avatar not found');
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
      },
      fileFilter: multerImageFilter,
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() avatarData: AvatarDto,
    @Req() req: any,
  ) {
    if (!file) {
      throw new NotFoundException('Please upload an image');
    }

    const user = req.user;

    if (user.role !== ERole.ADMIN) {
      throw new NotFoundException('You are not authorized to upload avatar');
    }

    try {
      const avatarUrl = await this.firebaseStorageService.uploadFile({
        file: file,
        path: `avatars`,
        fileName: formatName(avatarData.name),
      });
      avatarData.url = avatarUrl;
    } catch (error) {
      throw new NotFoundException('Upload avatar failed');
    }

    return this.avartarService.createAvatar(avatarData);
  }

  @Patch('update')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
      },
      fileFilter: multerImageFilter,
    }),
  )
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() avatarData: UpdateAvatarDto,
    @Req() req: any,
  ) {
    const user = req.user;

    if (user.role !== ERole.ADMIN) {
      throw new NotFoundException('You are not authorized to upload avatar');
    }

    const avatarById = await this.avartarService.getAvatarById({
      id: avatarData.id,
    });

    if (!avatarById) {
      throw new NotFoundException('Avatar not found');
    }

    if (avatarData.name) {
      if (avatarById.name !== avatarData.name) {
        const getAvatarByName = await this.avartarService.getAvatarByName({
          name: avatarData.name,
        });

        if (getAvatarByName) {
          throw new NotFoundException('Avatar name already exists');
        }
      }
    }

    if (file) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: file,
          path: `avatars`,
          fileName: formatName(avatarData.name),
        });
        avatarData.url = avatarUrl;
      } catch (error) {
        throw new NotFoundException('Upload avatar failed');
      }
    }

    return this.avartarService.updateAvatar(avatarData);
  }

  @Delete('delete/:id')
  async deleteAvatar(@Param() param: AvatarByIdDto, @Req() req: any) {
    const user = req.user;
    const id = param.id;

    if (user.role !== ERole.ADMIN) {
      throw new NotFoundException('You are not authorized to upload avatar');
    }

    const avatarById = await this.avartarService.getAvatarById({ id });

    if (!avatarById) {
      throw new NotFoundException('Avatar not found');
    }

    try {
      await this.avartarService.deleteAvatar({ id });
      return { message: 'Delete avatar successfully' };
    } catch (error) {
      throw new NotFoundException('Delete avatar failed');
    }
  }
}
