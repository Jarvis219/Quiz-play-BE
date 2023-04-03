// Import the functions you need from the SDKs you need
import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from 'src/common';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

export function initializeFirebaseApp() {
  // Initialize Firebase
  initializeApp(firebaseConfig);
}

@Injectable()
export class FirebaseStorageService {
  public async uploadFile({
    file,
    path,
    fileName,
  }: {
    file: Express.Multer.File;
    path: string;
    fileName: string;
  }): Promise<string> {
    const storageRef = getStorage();

    const fileExtension = file.originalname.split('.').pop();
    const fileRef = ref(storageRef, `${path}/${fileName}.${fileExtension}`);

    const uploadedFile = await uploadBytes(fileRef, file.buffer);

    return getDownloadURL(uploadedFile.ref);
  }
}
