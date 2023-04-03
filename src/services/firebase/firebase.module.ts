import { Module } from '@nestjs/common';
import {
  FirebaseStorageService,
  initializeFirebaseApp,
} from './firebase.service';

initializeFirebaseApp();
@Module({
  controllers: [],
  providers: [FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class FirebaseModule {}
