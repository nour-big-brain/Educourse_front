import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Question {
  id: number;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctAnswer: string;
  points: number;
}

interface ExamResult {
  score: number;
  passed: boolean;
}

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit {

  examId: number;
  coursId!: number ;
  questions: Question[] = [];
  answers: { [key: number]: string } = {};
  result: ExamResult | null = null;
  etudId: number | null = null; // Store the student ID

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private questionService: QuestionService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    const etudId = this.authService.getEtudiantId(); // Use AuthService to get etudId
    if (!etudId) {
      console.error('Student ID (etudId) is missing!');
      alert('You must be logged in as a student to take the exam.');
      this.router.navigate(['/login']); // Redirect to login if etudId is missing
    }
    this.etudId = etudId;
  
    const coursId = this.route.snapshot.paramMap.get('coursId');
    if (!coursId) {
      console.error('Course ID is missing in the route parameters!');
      this.router.navigate(['/cours']);
    }
    this.coursId = coursId ? +coursId : 0;
  
    const id = this.route.snapshot.paramMap.get('examId');
    this.examId = id ? +id : 0;
  }

  ngOnInit(): void {
    this.loadQuestions();
  }
  downloadCertificate() {
    const url = `http://localhost:8085/certificats/download/${this.etudId}/${this.examId}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'certificate.pdf';
        link.click();
      },
      error: (err) => {
        console.error('Error downloading certificate', err);
        alert('Error downloading certificate. Please try again later.');
      }
    });
  }

  loadQuestions() {
    this.questionService.getQuestionsByExamId(this.examId).subscribe({
      next: (data) => {
        this.questions = data as Question[];
      },
      error: (err) => {
        console.error('Error loading questions', err);
      }
    });
  }
  goBackToExams() {
    this.router.navigate(['/cours', this.coursId, 'exams']);
  }
  submitAnswers(event: Event) {
    event.preventDefault();
    
    if (Object.keys(this.answers).length !== this.questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }
  
    this.http.post<{ score: number, passed: boolean }>(`http://localhost:8085/examens/${this.examId}/submit`, this.answers)
      .subscribe({
        next: (result) => {
          this.result = result; 
        },
        error: (err) => {
          console.error('Error submitting answers', err);
          alert('Error submitting exam. Please try again.');
        }
      });
  }
  

  selectAnswer(questionId: number, choice: string) {
    this.answers[questionId] = choice;
  }

  getOption(question: Question, choice: string): string {
    switch (choice) {
      case 'A':
        return question.optionA;
      case 'B':
        return question.optionB;
      case 'C':
        return question.optionC;
      default:
        return '';
    }
  }

  isSelected(questionId: number, choice: string): boolean {
    return this.answers[questionId] === choice;
  }
}