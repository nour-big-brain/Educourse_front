import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../modals/question';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./update-question.component.css']
})
export class UpdateQuestionComponent implements OnInit {
  questionId: number | null = null;
  examId: number | null = null; // Store the examId
  question: Question = {
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
    // Get the question ID and exam ID from the route parameters
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.questionId = Number(this.route.snapshot.paramMap.get('questionId'));
    if (this.questionId && this.examId) {
      this.loadQuestion();
    } else {
      console.error('Question ID or Exam ID is missing!');
    }
  }

  // Load the question details
  loadQuestion(): void {
    if (this.examId) {
      this.isLoading = true;
      this.questionService.getQuestionsByExamId(this.examId).subscribe(
        (questions) => {
          // Find the specific question by its ID
          this.question = questions.find((q) => q.id === this.questionId) || this.question;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching questions:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Exam ID is missing!');
    }
  }

  // Save the updated question
  saveQuestion(): void {
    if (this.questionId) {
      this.questionService.createQuestion(this.question).subscribe(
        (updatedQuestion) => {
          console.log('Question updated successfully:', updatedQuestion);
          // Optionally, navigate back to the question management page or show a success message
          this.router.navigate(['/manage-questions', this.examId]);},
        (error) => {
          console.error('Error updating question:', error);
        }
      );
    }
  }

  // Navigate back to the question management page
  navigateToManageQuestions(): void {
    if (this.question.exam?.id) {
      this.router.navigate(['/manage-questions', this.question.exam.id]);
    } else {
      console.error('Exam ID is missing!');
    }
  }
}