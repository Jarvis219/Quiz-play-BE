import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Quiz as QuizModel } from '@prisma/client';
import { QuizDto, QuizUpdateDto } from 'src/common/quiz.dto';
import { generateSlug } from 'src/utils';
import { UserService } from '../user';
import { QuizService } from './quiz.service';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
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
  async createUser(@Body() data: QuizDto): Promise<QuizModel> {
    const user = await this.userService.getById(data.authorId);

    if (!user) {
      throw new NotFoundException(`User with id "${data.authorId}" not found`);
    }

    data.slug = generateSlug(data.title);

    return this.quizService.createQuiz({
      id: data.id || undefined,
      slug: data.slug,
      authorId: data.authorId,
      title: data.title,
      content: data.content,
      published: data.published,
      countPlayers: data.countPlayers,
      quizDetails: data.quizDetails,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/update/:slug')
  async updateUser(@Body() data: QuizUpdateDto, @Param('slug') slug: string) {
    const [quiz, user] = await Promise.all([
      this.quizService.quizBySlug(slug),
      this.userService.getById(data.authorId),
    ]);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with id "${data.authorId}" not found`);
    }

    if (!data.quizDetails) {
      data.quizDetails = [];
    }

    return this.quizService.updateQuiz(slug, {
      id: data.id,
      slug: data.slug,
      authorId: data.authorId,
      title: data.title,
      content: data.content,
      published: data.published,
      countPlayers: data.countPlayers,
      quizDetails: data.quizDetails,
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
