import { Component, OnInit } from '@angular/core';
import { EnseignantService } from '../../services/enseignant.service';
import { ExamenService } from '../../services/examen.service';
import { AuthService } from '../../services/auth.service';
import { Cours } from '../../modals/cours';
import { Examen } from '../../modals/examen';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-management',
  templateUrl: './exam-management.component.html',
  imports: [DatePipe],
  standalone: true,
  styleUrls: ['./exam-management.component.css']
})
export class ExamManagementComponent implements OnInit {
  teacherCourses: Cours[] = [];
  selectedCourseId: number | null = null;
  exams: Examen[] = [];
  isLoading = false;
  selectedCourseTitle: string | null = null; // Add this property to store the course title


  constructor(
    private enseignantService: EnseignantService,
    private examenService: ExamenService,
    private authService: AuthService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.loadTeacherCourses();
  }

  // Load courses for the logged-in teacher
  loadTeacherCourses(): void {
    const teacherId = this.authService.getTeacherId();
    if (teacherId) {
      this.isLoading = true;
      this.enseignantService.getTeacherCourses(teacherId).subscribe(
        (courses) => {
          this.teacherCourses = courses;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching teacher courses:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Teacher ID is missing!');
    }
  }

  loadExamsByCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    const selectedCourse = this.teacherCourses.find(course => course.idCours === courseId);
    this.selectedCourseTitle = selectedCourse ? selectedCourse.titre_cours : null; // Set the course title
    this.isLoading = true;
    this.examenService.getExamsByCourse(courseId).subscribe(
      (exams) => {
        this.exams = exams;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching exams:', error);
        this.isLoading = false;
      }
    );
  }

  // Delete an exam
  deleteExam(examId: number): void {
    this.examenService.deleteExam(examId).subscribe(
      () => {
        console.log('Exam deleted successfully');
        this.exams = this.exams.filter((exam) => exam.idEx !== examId); // Remove the deleted exam from the list
      },
      (error) => {
        console.error('Error deleting exam:', error);
      }
    );
  }

  // Update an exam (placeholder logic)
  updateExam(exam: Examen): void {
    // Add your update logic here
    this.router.navigate(['/manage-questions/', exam.idEx]);
  }
}