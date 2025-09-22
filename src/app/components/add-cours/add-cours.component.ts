import { Component } from '@angular/core';
import { Cours } from '../../modals/cours';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../../services/cours.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EnseignantService } from '../../services/enseignant.service';

@Component({
  selector: 'app-add-cours',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-cours.component.html',
  styleUrl: './add-cours.component.css'
})
export class AddCoursComponent {
  cours: Cours = {
    idCours: 0, 
    titre_cours: '',
    duree_cours: 0,
    materials: [],
    image:null,
  };
  teacherId!: number; 
  coursList: Cours[] = []; 
  examId!: number;
  selectedImage: File | null = null;

  
  // To manage visibility of the exam input form
  examFormVisible: { [courseId: number]: boolean } = {};

  // New exam data
  newExam = {
    titre: '',
    date_ex: ''
  };

  constructor(
    private coursService: CoursService,
    private router: Router,
    private authService: AuthService,
    private enseignantService: EnseignantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.teacherId = this.authService.getTeacherId()!;
    this.loadTeacherCourses();
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }
  addCours(): void {
    const formData = new FormData();
    formData.append('titre_cours', this.cours.titre_cours);
    formData.append('duree_cours', this.cours.duree_cours.toString());
    if (this.selectedImage) {
      formData.append('image', this.selectedImage); 
    }
  
    this.coursService.saveCoursWithImage(formData).subscribe({
      next: (response) => {
        console.log('✅ Course saved with image:', response);
  
        // After the course is created, assign it to the teacher
        this.coursService.assignCourseToTeacher(this.teacherId, response.idCours).subscribe({
          next: () => {
            console.log('✅ Course assigned to teacher');
            this.loadTeacherCourses(); // Reload the courses after assignment
          },
          error: (err) => {
            console.error('❌ Error assigning course to teacher:', err);
          }
        });
      },
      error: (err) => {
        console.error('❌ Error saving course with image:', err);
      }
    });
  }
  
  
  loadTeacherCourses(): void {
    this.enseignantService.getTeacherCourses(this.teacherId).subscribe((data) => {
      this.coursList = data;
    });
  }

  showExamForm(courseId: number): void {
    this.examFormVisible[courseId] = !this.examFormVisible[courseId];
  }

  addExam(courseId: number): void {
    const newExamData = {
      titre: this.newExam.titre,
      date: this.newExam.date_ex
    };
  
    this.coursService.createAndAssignExam(courseId, newExamData).subscribe({
      next: (exam: any) => {
        console.log('Exam added:', exam);
        this.router.navigate([`/cours/${courseId}/exams/${exam.idEx}/add`]);
      },
      error: (err) => {
        console.error('Error adding exam:', err);
      }
    });
  }

  addMaterial(coursId: number): void {
    this.router.navigate([`/cours/${coursId}/materials/add`]); 
  }
}
