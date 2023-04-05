import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
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

export class QuizDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: EQuestionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isAnswered: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photo: string;
}

export class QuizDetailUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: EQuestionType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  points: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isAnswered: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quizId: number;
}

export class QuizDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  countPlayers: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => QuizDetailDto)
  quizDetails: QuizDetailDto;
}

export class QuizUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  authorId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  published: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  countPlayers: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => QuizDetailUpdateDto)
  quizDetails: QuizDetailUpdateDto[];
}
