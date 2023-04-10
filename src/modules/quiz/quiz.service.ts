import { Injectable } from '@nestjs/common';
import { Quiz as QuizModel } from '@prisma/client';
import { QuizDto, QuizLikeUpdateDto, QuizUpdateDto } from 'src/common/quiz.dto';
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
        quizDetails: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async quizByCode(code: string): Promise<QuizModel> {
    return this.prisma.quiz.findFirst({
      where: {
        code,
      },
      include: {
        quizDetails: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async getQuizDetailAnswerBySlug({
    slug,
  }: {
    slug: string;
  }): Promise<QuizModel> {
    return this.prisma.quiz.findFirst({
      where: {
        slug,
      },
      include: {
        quizDetails: {
          include: {
            answers: true,
          },
        },
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
      photo: quizDetail.photo || null,
      keyImage: quizDetail.keyImage || null,
      answers: {
        create: quizDetail.answers.map((answer) => ({
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        })),
      },
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
        quizDetails: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async updateQuiz(slug: string, data: QuizUpdateDto): Promise<QuizModel> {
    const quizDetailUpdate = data.quizDetails.map((quizDetail) => {
      const quizDetailAnswersUpdate = quizDetail.answers.map((answer) => ({
        where: {
          id: answer.id || -1,
        },
        update: {
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        },
        create: {
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        },
      }));

      return {
        where: {
          id: quizDetail.id || -1,
        },
        update: {
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          photo: quizDetail.photo,
          keyImage: quizDetail.keyImage,
          answers: {
            upsert: quizDetailAnswersUpdate,
          },
        },
        create: {
          question: quizDetail.question,
          type: quizDetail.type,
          points: quizDetail.points,
          photo: quizDetail.photo,
          keyImage: quizDetail.keyImage,
          answers: {
            create: quizDetail.answers.map((answer) => ({
              answer: answer.answer,
              isCorrect: answer.isCorrect,
            })),
          },
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
        quizDetails: {
          include: {
            answers: true,
          },
        },
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

  async deleteQuizDetailAnswer({ id }: { id: number }) {
    return this.prisma.answer.delete({
      where: {
        id,
      },
    });
  }

  async getQuizDetailById({ id }: { id: number }) {
    return this.prisma.quizDetail.findFirst({
      where: {
        id,
      },
    });
  }

  async getQuizLikeByQuizIdAndUserId({ quizId, userId }: QuizLikeUpdateDto) {
    return this.prisma.quizLike.findFirst({
      where: {
        quizId,
        userId,
      },
    });
  }

  async createQuizLike({ quizId, userId }: QuizLikeUpdateDto) {
    return this.prisma.quizLike.create({
      data: {
        quizId,
        userId,
      },
    });
  }

  async deleteQuizLike({ likeId }: { likeId: number }) {
    return this.prisma.quizLike.delete({
      where: {
        id: likeId,
      },
    });
  }

  async getQuizLikeCountByQuizId({ quizId }: { quizId: number }) {
    return this.prisma.quizLike.count({
      where: {
        quizId,
      },
    });
  }

  async updateQuizShareCount({ quizId }: { quizId: number }) {
    return this.prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        share: {
          increment: 1,
        },
      },
    });
  }

  async updateQuizViewCount({ quizId }: { quizId: number }) {
    return this.prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
}
