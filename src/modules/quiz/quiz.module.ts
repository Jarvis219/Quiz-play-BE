import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/services';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [PrismaModule, UserModule, FirebaseModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
