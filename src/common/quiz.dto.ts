import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum EQuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface IQuizDetail {
  id?: number;
  question: string;
  type: EQuestionType;
  points: number;
  isAnswered: boolean;
  image?: string;
}

export interface IQuizDetailUpdate {
  id?: number;
  question?: string;
  type?: EQuestionType;
  points?: number;
  isAnswered?: boolean;
  image?: string;
  quizId?: number;
}

export class QuizDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  countPlayers: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  quizDetails: IQuizDetail[];
}

export type QuizUpdateDto = Omit<QuizDto, 'quizDetails'> & {
  quizDetails?: IQuizDetailUpdate[];
};
