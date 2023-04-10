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
import { UserService } from '../user';
import { QuizService } from './quiz.service';

@ApiTags('quiz/view')
@Controller('quiz/view')
export class QuizViewController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/update/:slug')
  async updateQuizView(@Param('slug') slug: string, @Req() req: any) {
    const userId = req.user.id;

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

    await this.quizService.updateQuizViewCount({ quizId: quiz.id });
    return { viewed: true, message: 'You viewed this quiz successfully' };
  }

  @Get('/count/:slug')
  async getQuizViewCountByQuizSlug(@Param('slug') slug: string) {
    const quiz = await this.quizService.quizBySlug(slug);

    if (!quiz) {
      throw new NotFoundException(`Quiz with slug "${slug}" not found`);
    }

    return {
      views: quiz.views,
    };
  }
}
