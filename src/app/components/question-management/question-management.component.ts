import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../modals/question';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  imports: [FormsModule],
  standalone: true,
  styleUrls: ['./question-management.component.css']
})
export class QuestionManagementComponent implements OnInit {
  examId: number | null = null;
  questions: Question[] = [];
  newQuestion: Question = {
    id: 0,
    content: '',
    optionA: '',
    optionB: '',
    optionC: '',
    correctAnswer: '',
    points: 0,
    exam: undefined
  };
  isLoading = false;

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the exam ID from the route parameters
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    if (this.examId) {
      this.loadQuestions();
    } else {
      console.error('Exam ID is missing!');
    }
  }

  // Load all questions for the exam
  loadQuestions(): void {
    if (this.examId) {
      this.isLoading = true;
      this.questionService.getQuestionsByExamId(this.examId).subscribe(
        (questions) => {
          this.questions = questions;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching questions:', error);
          this.isLoading = false;
        }
      );
    }
  }

  // Add a new question
  addQuestion(): void {
    if (this.examId) {
      this.newQuestion.exam = { id: this.examId }; // Set the exam relationship
      this.questionService.assignQuestionToExam(this.newQuestion, this.examId).subscribe(
        (question) => {
          console.log('Question added successfully:', question);
          this.questions.push(question);
          this.newQuestion = {
            id: 0,
            content: '',
            optionA: '',
            optionB: '',
            optionC: '',
            correctAnswer: '',
            points: 0,
            exam: undefined
          }; // Reset the form
        },
        (error) => {
          console.error('Error adding question:', error);
        }
      );
    }
  }

  // Delete a question
  deleteQuestion(questionId: number): void {
    this.questionService.deleteQuestion(questionId).subscribe(
      () => {
        console.log('Question deleted successfully');
        this.questions = this.questions.filter((q) => q.id !== questionId); // Remove from the list
      },
      (error) => {
        console.error('Error deleting question:', error);
      }
    );
  }
  updateQuestion(question: Question): void {
    if (this.examId) {
      this.router.navigate([`/update-question/${this.examId}/${question.id}`]); // Pass examId and questionId in the URL
    } else {
      console.error('Exam ID is missing!');
    }
  }
}