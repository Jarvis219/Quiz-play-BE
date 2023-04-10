import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './modules/auth';
import { QuizModule } from './modules/quiz';
import { UserModule } from './modules/user';

@Module({
  imports: [UserModule, AuthModule, QuizModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}