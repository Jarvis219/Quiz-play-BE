import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/services';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user';
import { QuizController } from './quiz.controller';
import { QuizLikeController } from './quiz.like.controller';
import { QuizService } from './quiz.service';
import { QuizShareController } from './quiz.share.controller';
import { QuizViewController } from './quiz.view.controller';

@Module({
  imports: [PrismaModule, UserModule, FirebaseModule],
  controllers: [
    QuizController,
    QuizLikeController,
    QuizShareController,
    QuizViewController,
  ],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
