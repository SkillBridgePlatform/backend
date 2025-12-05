export class CreateQuizQuestionOptionDto {
  text: string;
  isCorrect: boolean;
}

export class CreateQuizQuestionDto {
  type: 'mcq' | 'multi_select' | 'true_false';
  questionText: string;
  options?: CreateQuizQuestionOptionDto[];
  correctAnswer?: boolean;
}

export class CreateQuizDto {
  title: string;
  passingScore?: number;
  questions: CreateQuizQuestionDto[];
}
