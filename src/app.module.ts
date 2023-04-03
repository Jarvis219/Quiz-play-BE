import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth';
import { QuizModule } from './modules/quiz';
import { UserModule } from './modules/user';
import { FirebaseModule } from './services';

@Module({
  imports: [UserModule, AuthModule, QuizModule, FirebaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
