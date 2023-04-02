import * as dotenv from 'dotenv';
dotenv.config();

export const { ENV, PORT } = process.env;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
