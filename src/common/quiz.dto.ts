import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum EQuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export class QuizDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  keyImage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: EQuestionType;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @ApiProperty()
  @Transform(({ value }) => Boolean(value))
  @IsNotEmpty()
  @IsBoolean()
  isAnswered: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo: string;
}

export class QuizDetailUpdateDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyImage: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  points: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  isAnswered: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  quizId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    required: true,
    enum: EQuestionType,
  })
  @IsNotEmpty()
  @IsString()
  type: EQuestionType;
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

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ required: false })
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDetailDto)
  quizDetails: QuizDetailDto[];
}

export class QuizUpdateDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizDetailUpdateDto)
  quizDetails: QuizDetailUpdateDto[];
}
