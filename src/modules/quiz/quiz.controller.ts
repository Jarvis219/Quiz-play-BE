import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Quiz as QuizModel } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE, multerImageFilter } from 'src/common';
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
    FileInterceptor('photo', {
      limits: {
        fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
      },
      fileFilter: multerImageFilter,
    }),
  )
  async createQuiz(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: QuizDto,
  ): Promise<QuizModel> {
    const quizDto = plainToClass(QuizDto, data);
    await validateOrReject(quizDto);

    const user = await this.userService.getById(quizDto.authorId);

    if (!user) {
      throw new NotFoundException(
        `User with id "${quizDto.authorId}" not found`,
      );
    }

    quizDto.slug = generateSlug(quizDto.title);
    quizDto.code = generateCode();

    const quizByCode = await this.quizService.quizByCode(quizDto.code);

    if (quizByCode) {
      throw new NotFoundException(`Code "${quizDto.code}" already exists`);
    }

    // for (const quizDetail of quizDto.quizDetails) {
    //   await this.firebaseStorageService.uploadFile({
    //     file: quizDetail.image as unknown as Express.Multer.File,
    //     path: `quizs/${user.username}/${quizDto.slug}/images`,
    //     fileName: 'quiz-image',
    //   });
    // }

    if (file) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: file,
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
      authorId: quizDto.authorId,
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
    FileInterceptor('photo', {
      limits: {
        fileSize: DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE,
      },
      fileFilter: multerImageFilter,
    }),
  )
  async updateQuiz(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: QuizUpdateDto,
    @Param('slug') slug: string,
  ) {
    const [quiz, user] = await Promise.all([
      this.quizService.quizBySlug(slug),
      this.userService.getById(data.authorId),
    ]);

    const quizUpdateDto = plainToClass(QuizUpdateDto, data);
    await validateOrReject(quizUpdateDto);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    if (!user) {
      throw new NotFoundException(
        `User with id "${quizUpdateDto.authorId}" not found`,
      );
    }

    if (!quizUpdateDto.quizDetails) {
      quizUpdateDto.quizDetails = [];
    }

    if (file) {
      try {
        const avatarUrl = await this.firebaseStorageService.uploadFile({
          file: file,
          path: `quiz/${user.username}/${quizUpdateDto.slug}/photo`,
          fileName: 'quiz-photo',
        });
        quizUpdateDto.photo = avatarUrl;
      } catch (error) {
        throw new NotFoundException('Upload photo failed');
      }
    }

    return this.quizService.updateQuiz(slug, {
      id: quizUpdateDto.id,
      slug: quizUpdateDto.slug,
      authorId: quizUpdateDto.authorId,
      title: quizUpdateDto.title,
      content: quizUpdateDto.content,
      published: quizUpdateDto.published,
      countPlayers: quizUpdateDto.countPlayers,
      quizDetails: quizUpdateDto.quizDetails,
      code: quizUpdateDto.code,
      photo: quizUpdateDto.photo,
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
    const quizDetail = await this.quizService.getQuizDetailById(id);

    if (!quizDetail) {
      throw new NotFoundException(`QuizDetail with id "${id}" not found`);
    }

    return this.quizService.deleteQuizDetail(quizDetail);
  }
}
