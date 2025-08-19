
export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface TrueFalse {
  question:string;
  answer: boolean;
}

export interface QuizData {
  mcqs: MCQ[];
  trueFalse: TrueFalse[];
}
