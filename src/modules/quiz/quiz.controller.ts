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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Quiz as QuizModel } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
  MAX_COUNT_QUIZ_DETAIL_PHOTO,
  multerImageFilter,
} from 'src/common';
import { QuizDto, QuizUpdateDto } from 'src/common/quiz.dto';
import { FirebaseStorageService } from 'src/services';
import { generateCode, generateSlug } from 'src/utils';
import { UserService } from '../user';
import { QuizService } from './quiz.service';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @Get('')
  async getQuizs(): Promise<QuizModel[]> {
    return this.quizService.quiz();
  }

  @Get('/:slug')
  async getQuizBySlug(@Body('slug') slug: string): Promise<QuizModel> {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    return quiz;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        {
          name: 'quizDetailPhoto',
          maxCount: MAX_COUNT_QUIZ_DETAIL_PHOTO,
        },
      ],
      {
        limits: {
          fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
        },
        fileFilter: multerImageFilter,
      },
    ),
  )
  async createQuiz(
    @UploadedFiles() file: Express.Multer.File[],
    @Body() data: QuizDto,
    @Req() req: any,
  ): Promise<QuizModel> {
    const quizDto = plainToClass(QuizDto, data);
    await validateOrReject(quizDto);

    const userId = req.user.id;

    const user = await this.userService.getById(userId);

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    quizDto.slug = generateSlug(quizDto.title);
    quizDto.code = generateCode();

    const quizByCode = await this.quizService.quizByCode(quizDto.code);

    if (quizByCode) {
      throw new NotFoundException(`Code "${quizDto.code}" already exists`);
    }

    const photo = file?.['photo']?.[0];
    const quizDetailPhoto = file?.['quizDetailPhoto'];

    if (quizDetailPhoto) {
      for (const quizDetail of quizDto.quizDetails) {
        for (const quizDetailPhotoItem of quizDetailPhoto) {
          if (quizDetail.keyImage !== quizDetailPhotoItem.originalname)
            continue;
          const photoItem = await this.firebaseStorageService.uploadFile({
            file: quizDetailPhotoItem,
            path: `quiz/${user.username}/${quizDto.slug}/images`,
            fileName: 'quiz-image',
          });
          quizDetail.photo = photoItem;
        }
      }
    }

    if (photo) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: photo,
          path: `quiz/${user.username}/${quizDto.slug}/photo`,
          fileName: `${quizDto.slug}-photo`,
        });
        quizDto.photo = avatarUrl;
      } catch (error) {
        throw new NotFoundException('Upload photo failed');
      }
    }

    return this.quizService.createQuiz({
      id: quizDto.id || undefined,
      slug: quizDto.slug,
      authorId: userId,
      title: quizDto.title,
      content: quizDto.content,
      published: quizDto.published,
      countPlayers: quizDto.countPlayers,
      quizDetails: quizDto.quizDetails,
      code: quizDto.code,
      photo: quizDto.photo,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update/:slug')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        {
          name: 'quizDetailPhoto',
          maxCount: MAX_COUNT_QUIZ_DETAIL_PHOTO,
        },
      ],
      {
        limits: {
          fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
        },
        fileFilter: multerImageFilter,
      },
    ),
  )
  async updateQuiz(
    @UploadedFiles() file: Express.Multer.File[],
    @Body() data: QuizUpdateDto,
    @Param('slug') slug: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;

    const quizUpdateDto = plainToClass(QuizUpdateDto, data);
    await validateOrReject(quizUpdateDto);

    if (!slug) throw new NotFoundException('Slug is required');

    const [quiz, user] = await Promise.all([
      this.quizService.quizBySlug(slug),
      this.userService.getById(userId),
    ]);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    if (userId !== quiz.authorId) {
      throw new NotFoundException(
        `You can't update this quiz because you are not the author`,
      );
    }

    if (!quizUpdateDto.quizDetails) {
      quizUpdateDto.quizDetails = [];
    }

    const photo = file?.['photo']?.[0];
    const quizDetailPhoto = file?.['quizDetailPhoto'];

    if (quizDetailPhoto) {
      for (const quizDetail of quizUpdateDto.quizDetails) {
        for (const quizDetailPhotoItem of quizDetailPhoto) {
          if (quizDetail.keyImage !== quizDetailPhotoItem.originalname)
            continue;
          const photoItem = await this.firebaseStorageService.uploadFile({
            file: quizDetailPhotoItem,
            path: `quiz/${user.username}/${quizUpdateDto.slug}/images`,
            fileName: 'quiz-image',
          });
          quizDetail.photo = photoItem;
        }
      }
    }

    if (photo) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: photo,
          path: `quiz/${user.username}/${quizUpdateDto.slug}/photo`,
          fileName: `${quizUpdateDto.slug}-photo`,
        });
        quizUpdateDto.photo = avatarUrl;
      } catch (error) {
        throw new NotFoundException('Upload photo failed');
      }
    }

    return this.quizService.updateQuiz(slug, {
      id: quizUpdateDto.id || quiz.id,
      slug,
      authorId: userId,
      title: quizUpdateDto.title || quiz.title,
      content: quizUpdateDto.content || quiz.content,
      published: quizUpdateDto.published || quiz.published,
      countPlayers: quizUpdateDto.countPlayers || quiz.countPlayers,
      quizDetails: quizUpdateDto.quizDetails,
      code: quizUpdateDto.code || quiz.code,
      photo: quizUpdateDto.photo || quiz.photo,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:slug')
  async deleteUser(@Param('slug') slug: string) {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    return this.quizService.deleteQuiz({
      slug,
      quiz,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/quiz-detail/:id')
  async deleteQuizDetail(@Param('id') id: number) {
    id = Number(id);
    const quizDetail = await this.quizService.getQuizDetailById({ id });

    if (!quizDetail) {
      throw new NotFoundException(`QuizDetail with id "${id}" not found`);
    }

    try {
      await this.quizService.deleteQuizDetail({ id });
      return true;
    } catch (error) {
      throw new NotFoundException('Delete quiz detail failed');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/quiz-detail/answer/:slug/:id')
  async deleteQuizDetailAnswer(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Req() req: any,
  ) {
    id = Number(id);

    const userId = req.user.id;

    const [user, quizDetailAnswer] = await Promise.all([
      this.userService.getById(userId),
      this.quizService.getQuizDetailAnswerBySlug({
        slug,
      }),
    ]);

    if (userId !== quizDetailAnswer.authorId) {
      throw new NotFoundException(
        `You can't delete this quiz detail answer because you are not the author`,
      );
    }

    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    if (!quizDetailAnswer) {
      throw new NotFoundException(`QuizDetailAnswer with id "${id}" not found`);
    }

    try {
      await this.quizService.deleteQuizDetailAnswer({ id });
      return true;
    } catch (error) {
      throw new NotFoundException('Delete quiz detail answer failed');
    }
  }
}
