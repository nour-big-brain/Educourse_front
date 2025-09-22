import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../modals/question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8085/questions';

  constructor(private http: HttpClient) { }

  // Get questions for an exam
  getQuestionsByExamId(examId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/exam/${examId}`);
  }

  // Create a new question
  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  // Delete a question
  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${questionId}`);
  }

  // Assign question to exam
  assignQuestionToExam(question: Question, examId: number): Observable<Question> {
    return this.http.post<Question>(
      `${this.apiUrl}/assign-to-exam/${examId}`, 
      question
    );
  }
}
