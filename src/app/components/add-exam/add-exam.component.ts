import { Component, OnInit } from '@angular/core';
import { Question } from '../../modals/question';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css']
})
export class AddExamComponent implements OnInit {
  examId: number = 0;
  isTeacher: boolean = false;
  newQuestion: Question = { 
    content: '', 
    optionA: '', 
    optionB: '', 
    optionC: '', 
    correctAnswer: '', 
    points: 0 
  };
  isLoading: boolean = false;
  questions: Question[] = [];
  coursId!: number;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = +this.route.snapshot.paramMap.get('examId')!;
    this.coursId = +this.route.snapshot.paramMap.get('coursId')!;
  
    if (isNaN(this.examId) ){
      console.error('Invalid exam ID');
      this.router.navigate(['/cours']);
      return;
    }
  
    this.isTeacher = this.authService.getUserRole() === 'TEACHER';
    this.loadQuestions();
  }
  
  private loadQuestions(): void {
    this.isLoading = true;
    this.questionService.getQuestionsByExamId(this.examId).subscribe({
      next: (questions) => {
        this.questions = questions || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.isLoading = false;
      }
    });
  }

  addQuestion(): void {
    if (!this.validateQuestion()) return;
  
    this.isLoading = true;
    
    this.questionService.createQuestion(this.newQuestion).subscribe({
      next: (createdQuestion) => {
        console.log('Question created:', createdQuestion);
        
        this.questionService.assignQuestionToExam(createdQuestion, this.examId).subscribe({
          next: (assignedQuestion) => {
            console.log('Question assigned to exam:', assignedQuestion);
            this.questions = [...this.questions, assignedQuestion];
            this.resetQuestionForm();
            this.isLoading = false;
          },
          error: (assignErr) => {
            console.error('Error assigning question to exam:', assignErr);
            this.isLoading = false;
          }
        });
      },
      error: (createErr) => {
        console.error('Error creating question:', createErr);
        this.isLoading = false;
      }
    });
  }

  private resetQuestionForm(): void {
    this.newQuestion = { 
      content: '', 
      optionA: '', 
      optionB: '', 
      optionC: '', 
      correctAnswer: '', 
      points: 0 
    };
  }

  private validateQuestion(): boolean {
    if (!this.isTeacher) {
      alert('Only teachers can add questions');
      return false;
    }
  
    if (!this.newQuestion.content?.trim()) {
      alert('Please enter a valid question');
      return false;
    }
  
    if (!this.newQuestion.optionA?.trim() || 
        !this.newQuestion.optionB?.trim() || 
        !this.newQuestion.optionC?.trim()) {
      alert('Please fill all options for the question');
      return false;
    }
  
    if (!['A', 'B', 'C'].includes(this.newQuestion.correctAnswer?.trim().toUpperCase())) {
      alert('Please specify a valid correct answer (A, B, or C)');
      return false;
    }
  
    if (this.newQuestion.points <= 0) {
      alert('Please assign positive points to the question');
      return false;
    }
  
    return true;
  }

  trackByFn(index: number, question: Question): number {
    return question.id || index;
  }
  goBack(): void {
    this.router.navigate(['/cours']); // Navigate to /cours
  }
}