import * as dotenv from 'dotenv';
dotenv.config();

export const {
  ENV,
  PORT,
  SECRET_KEY,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} = process.env;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const usernameRegex = /^[a-zA-Z0-9_]+$/;
