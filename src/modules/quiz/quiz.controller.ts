import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Quiz as QuizModel } from '@prisma/client';
import { QuizDto, QuizUpdateDto } from 'src/common/quiz.dto';
import { generateSlug } from 'src/utils';
import { QuizService } from './quiz.service';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

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

  @Post('/create')
  async createUser(@Body() data: QuizDto): Promise<QuizModel> {
    data.slug = generateSlug(data.title);
    return this.quizService.createQuiz(data);
  }

  @Patch('/update/:slug')
  async updateUser(@Body() data: QuizUpdateDto, @Param('slug') slug: string) {
    const quiz = (await this.quizService.quizBySlug(slug)) as QuizDto;

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    if (!data.quizDetails) {
      data.quizDetails = [];
    }

    return this.quizService.updateQuiz(slug, data);
  }

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

  @Delete('/delete/quiz-detail/:id')
  async deleteQuizDetail(@Param('id') id: number) {
    const quizDetail = await this.quizService.getQuizDetailById(id);

    if (!quizDetail) {
      throw new NotFoundException(`QuizDetail with id "${id}" not found`);
    }

    return this.quizService.deleteQuizDetail(quizDetail);
  }
}
