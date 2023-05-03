import {
  DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
  MAX_COUNT_DEFAULT_PHOTO,
  PATH_DEFAULT_IMAGE,
  multerImageFilter,
} from '@/common';
import { FirebaseStorageService } from '@/services';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('upload')
@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @Post('/images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: MAX_COUNT_DEFAULT_PHOTO }],
      {
        limits: {
          fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
        },
        fileFilter: multerImageFilter,
      },
    ),
  )
  async uploadImage(
    @UploadedFiles() file: Express.Multer.File[],
    @Body('path') path: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!path) {
      path = PATH_DEFAULT_IMAGE;
    }

    const urls = [];

    const files = file?.['image'];

    for (const f of files) {
      const url = await this.firebaseStorageService.uploadFile({
        file: f,
        path,
        fileName: f.originalname.split('.')[0],
      });
      urls.push(url);
    }

    return urls;
  }
}
