import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import { CreateQuizDto, CreateQuizQuestionDto } from './dto/create-quiz-dto';
import { Quiz } from './entities/quizzes.entity';
import { QuizzesRepository } from './quizzes.repository';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizzesRepository: QuizzesRepository) {}

  async getQuizzes(
    pagination: PaginationOptions = {},
    sort: SortOptions = {},
    search?: string,
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    return this.quizzesRepository.getQuizzes(pagination, sort, search);
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    return this.quizzesRepository.getQuizById(id);
  }

  async deleteQuiz(id: string): Promise<void> {
    await this.quizzesRepository.deleteQuiz(id);
  }

  async createQuiz(dto: CreateQuizDto): Promise<string> {
    try {
      const payload = this.buildQuizPayload(dto);
      const quizId = await this.quizzesRepository.createQuiz(payload);
      return quizId;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create quiz: ' + error.message,
      );
    }
  }

  private buildQuizPayload(dto: CreateQuizDto) {
    return {
      title: dto.title,
      passing_score: dto.passingScore,
      questions: dto.questions.map((q: CreateQuizQuestionDto) => {
        if (q.type === 'true_false') {
          return {
            type: 'true_false',
            question_text: q.questionText,
            correct_option: q.correctAnswer ? 'True' : 'False',
          };
        } else {
          return {
            type: q.type,
            question_text: q.questionText,
            options: q.options?.map((o) => ({
              option_text: o.text,
              is_correct: o.isCorrect,
            })),
          };
        }
      }),
    };
  }
}
