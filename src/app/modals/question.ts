export interface Question {
    id?: number;
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    correctAnswer: string;
    points: number;
    exam?: { id: number };
     // For relationship with exam
  }
