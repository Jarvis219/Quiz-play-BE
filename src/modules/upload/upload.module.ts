import { FirebaseModule } from '@/services';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}
