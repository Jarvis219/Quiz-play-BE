import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';

@ApiTags('quiz/share')
@Controller('quiz/share')
export class QuizShareController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/update/:slug')
  async updateQuizShare(@Param('slug') slug: string) {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    await this.quizService.updateQuizShareCount({ quizId: quiz.id });
    return { shared: true, message: 'You shared this quiz successfully' };
  }

  @Get('/count/:slug')
  async getQuizShareCountByQuizSlug(@Param('slug') slug: string) {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    return {
      shareCount: quiz.share,
    };
  }
}
