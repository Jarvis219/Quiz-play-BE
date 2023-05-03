import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './modules/auth';
import { AvatarModule } from './modules/avatar';
import { MailModule } from './modules/mail/mail.module';
import { QuizModule } from './modules/quiz';
import { UploadModule } from './modules/upload';
import { UserModule } from './modules/user';

@Module({
  imports: [
    UserModule,
    AuthModule,
    QuizModule,
    MailModule,
    AvatarModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
