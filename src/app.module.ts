import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { QuizModule } from './modules/quiz/quiz.module';
import { UserModule } from './modules/user';

@Module({
  imports: [UserModule, QuizModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
