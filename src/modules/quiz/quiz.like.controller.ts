import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';

@ApiTags('quiz/like')
@Controller('quiz/like')
export class QuizLikeController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/update/:slug')
  async updateQuizLike(@Param('slug') slug: string, @Req() req: any) {
    const user = req.user;
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    const quizLike = await this.quizService.getQuizLikeByQuizIdAndUserId({
      quizId: quiz.id,
      userId: user.id,
    });

    if (quizLike) {
      await this.quizService.deleteQuizLike({ likeId: quizLike.id });
      return { like: false, message: 'You unliked this quiz successfully' };
    }

    await this.quizService.createQuizLike({
      quizId: quiz.id,
      userId: user.id,
    });
    return { like: true, message: 'You liked this quiz successfully' };
  }

  @Get('/count/:slug')
  async getQuizLikeCountByQuizSlug(@Param('slug') slug: string) {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    const quizLikeCount = await this.quizService.getQuizLikeCountByQuizId({
      quizId: quiz.id,
    });

    return { likeCount: quizLikeCount };
  }
}
