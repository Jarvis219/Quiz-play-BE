import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from 'AppConfig';
import { AppModule } from './app.module';
import { ENV, PORT } from './common';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  if (ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle('Quiz')
      .setDescription('Quiz API description')
      .setVersion('1.0')
      .addTag('Quiz')
      .addBearerAuth(
        {
          description: `Please enter token in following format: Bearer <JWT>`,
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: AppConfig.whitelistDomains,
  });

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`AppConfig.Environment: run on ${PORT}`);
  });
}
bootstrap();
