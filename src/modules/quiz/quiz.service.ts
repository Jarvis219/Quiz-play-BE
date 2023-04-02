import { Injectable } from '@nestjs/common';
import {
  QuizDetail as QuizDetailModel,
  Quiz as QuizModel,
} from '@prisma/client';
import { IQuizDetailUpdate, QuizDto, QuizUpdateDto } from 'src/common/quiz.dto';
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

  async createQuiz({
    title,
    slug,
    authorId,
    content,
    published,
    quizDetails,
  }: QuizDto): Promise<QuizModel> {
    return this.prisma.quiz.create({
      data: {
        title,
        slug,
        authorId,
        content,
        published,
        quizDetails: {
          create: quizDetails,
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
        create: {
          quizId: data.id,
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          isAnswered: quizDetail.isAnswered,
          image: quizDetail.image,
        },
        update: {
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          isAnswered: quizDetail.isAnswered,
          image: quizDetail.image,
        },
      };
    });

    return await this.prisma.quiz.update({
      where: {
        slug,
      },
      data: {
        ...data,
        quizDetails: {
          upsert: quizDetailUpdate.map((quizDetail) => ({
            create: {
              ...quizDetail.create,
              quiz: undefined,
            },
            update: quizDetail.update,
            where: quizDetail.where,
          })),
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
    quizDetails: IQuizDetailUpdate[];
  }) {
    return this.prisma.quizDetail.createMany({
      data: quizDetails?.map((quizDetail) => ({
        question: quizDetail.question,
        type: quizDetail.type,
        points: quizDetail.points,
        isAnswered: quizDetail.isAnswered,
        image: quizDetail.image,
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
