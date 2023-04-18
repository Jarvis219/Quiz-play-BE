import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
  UpdateProfileDto,
  multerImageFilter,
} from 'src/common';
import { FirebaseStorageService } from 'src/services';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
      },
      fileFilter: multerImageFilter,
    }),
  )
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: UpdateProfileDto,
    @Req() req: any,
  ) {
    const user = req.user;

    if (file) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: file,
          path: `profile/avatar`,
          fileName: `${user.username}-avatar`,
        });
        userData.avatar = avatarUrl;
      } catch (error) {
        throw new NotFoundException('Upload avatar failed');
      }
    }

    if (userData.username) {
      if (user.username !== userData.username) {
        const checkUsername = await this.userService.getByUsername(
          userData.username,
        );
        if (checkUsername) {
          throw new NotFoundException('Username already exists');
        }
      }
    }

    const userUpdate = await this.userService.update(user.id, {
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      avatar: userData.avatar,
      phone_number: userData.phone_number,
      address: userData.address,
    });

    userUpdate.password = undefined;
    userUpdate.id = undefined;
    return userUpdate;
  }
}
