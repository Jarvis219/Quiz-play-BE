import { Injectable } from '@nestjs/common';
import {
  QuizDetail as QuizDetailModel,
  Quiz as QuizModel,
} from '@prisma/client';
import {
  QuizDetailUpdateDto,
  QuizDto,
  QuizUpdateDto,
} from 'src/common/quiz.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async quiz(): Promise<QuizModel[]> {
    return this.prisma.quiz.findMany();
  }

  async quizBySlug(slug: string): Promise<QuizModel> {
    return this.prisma.quiz.findFirst({
      where: {
        slug,
      },
      include: {
        quizDetails: true,
      },
    });
  }

  async quizByCode(code: string): Promise<QuizModel> {
    return this.prisma.quiz.findFirst({
      where: {
        code,
      },
      include: {
        quizDetails: true,
      },
    });
  }

  async createQuiz({
    title,
    slug,
    authorId,
    content,
    published,
    quizDetails,
    code,
    countPlayers,
    photo,
  }: QuizDto): Promise<QuizModel> {
    const quizDetailCreate = quizDetails.map((quizDetail) => ({
      question: quizDetail.question,
      type: quizDetail.type,
      points: quizDetail.points,
      isAnswered: quizDetail.isAnswered,
      photo: quizDetail.photo || null,
      keyImage: quizDetail.keyImage || null,
    }));

    return this.prisma.quiz.create({
      data: {
        title,
        slug,
        authorId,
        content,
        published,
        code,
        countPlayers,
        photo,
        quizDetails: {
          create: quizDetailCreate,
        },
      },
      include: {
        quizDetails: true,
      },
    });
  }

  async updateQuiz(slug: string, data: QuizUpdateDto): Promise<QuizModel> {
    const quizDetailUpdate = data.quizDetails.map((quizDetail) => {
      return {
        where: {
          id: quizDetail.id || -1,
        },
        update: {
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          isAnswered: quizDetail.isAnswered,
          photo: quizDetail.photo,
          keyImage: quizDetail.keyImage,
        },
        create: {
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          isAnswered: quizDetail.isAnswered,
          photo: quizDetail.photo,
          keyImage: quizDetail.keyImage,
        },
      };
    });

    return await this.prisma.quiz.update({
      where: {
        slug,
      },
      data: {
        title: data.title,
        content: data.content,
        countPlayers: data.countPlayers,
        published: data.published,
        photo: data.photo,
        quizDetails: {
          upsert: quizDetailUpdate,
        },
      },
      include: {
        quizDetails: true,
      },
    });
  }

  async deleteQuiz({
    slug,
    quiz,
  }: {
    slug: string;
    quiz: QuizModel;
  }): Promise<boolean> {
    await this.prisma.quizDetail.deleteMany({
      where: {
        quizId: quiz.id,
      },
    });

    await this.prisma.quiz.delete({
      where: {
        slug,
      },
    });

    return true;
  }

  async deleteQuizDetail({ id }: { id: number }) {
    return this.prisma.quizDetail.delete({
      where: {
        id,
      },
    });
  }

  async createManyQuizDetails({
    quizId,
    quizDetails,
  }: {
    quizId: number;
    quizDetails: QuizDetailUpdateDto[];
  }) {
    return this.prisma.quizDetail.createMany({
      data: quizDetails?.map((quizDetail) => ({
        question: quizDetail.question,
        type: quizDetail.type,
        points: quizDetail.points,
        isAnswered: quizDetail.isAnswered,
        image: quizDetail.photo,
        quiz: {
          connect: { id: quizId },
        },
      })),
    });
  }

  async getQuizDetailByQuizId({
    quizId,
  }: {
    quizId: number;
  }): Promise<QuizDetailModel[]> {
    return this.prisma.quizDetail.findMany({
      where: {
        quizId,
      },
    });
  }

  async getQuizDetailById(id: number): Promise<QuizDetailModel> {
    return this.prisma.quizDetail.findFirst({
      where: {
        id,
      },
    });
  }
}
