import { UnsupportedMediaTypeException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { FileFilterCallback } from 'multer';
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
  API_GOOGLE_GET_INFOR,
} = process.env;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const usernameRegex = /^[a-zA-Z0-9_]+$/;
export const DEFAULT_IMAGE_UPLOAD_LIMIT_SIZE = 5 * 1024 * 1000; // 50MB
export const MAX_COUNT_QUIZ_DETAIL_PHOTO = 100;

export const VALID_IMAGE_MIME_TYPES = [
  'image/bmp',
  'image/cis-cod',
  'image/gif',
  'image/ief',
  'image/jpeg',
  'image/png',
  'image/pipeg',
  'image/svg+xml',
  'image/tiff',
  'image/x-cmu-raster',
  'image/x-cmx',
  'image/x-icon',
  'image/x-portable-anymap',
  'image/x-portable-bitmap',
  'image/x-portable-graymap',
  'image/x-portable-pixmap',
  'image/x-rgb',
  'image/x-xbitmap',
  'image/x-xpixmap',
  'image/x-xwindowdump',
  'image/avif',
  'image/webp',
];

// Image only
export const multerImageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!VALID_IMAGE_MIME_TYPES.includes(file.mimetype))
    callback(
      new UnsupportedMediaTypeException(
        `Unsupported media type: ${file.mimetype}`,
      ),
    );
  callback(null, true);
};

export const EXPIRESIN = '60d';
