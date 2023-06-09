import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/services';
import { PrismaModule } from '../prisma/prisma.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [AvatarController],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
