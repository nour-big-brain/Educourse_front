import { Component, OnInit } from '@angular/core';
import { Cours } from '../../modals/cours';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../../services/cours.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-material',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-material.component.html',
  styleUrls: ['./add-material.component.css']
})
export class AddMaterialComponent implements OnInit {

  cours: Cours = new Cours();
  newMaterialUrl: string = '';
  isTeacher: boolean = false;
  isLoading: boolean = true;
  currentCourseId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private coursService: CoursService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentCourseId = +this.route.snapshot.params['coursId'];
    this.isTeacher = this.authService.getUserRole() === 'TEACHER';

    if (isNaN(this.currentCourseId)) {
      console.error('Invalid course ID in route');
      this.router.navigate(['/courses']);
      return;
    }

    this.loadCourseData();
  }
  deleteMaterial(_t7: number) {
    throw new Error('Method not implemented.');

    
    }
  private loadCourseData(): void {
    this.isLoading = true;

    // Load course details
    this.coursService.getCoursById(this.currentCourseId).subscribe({
      next: (courseDetails) => {
        this.cours = courseDetails;
        this.loadMaterials();
      },
      error: (err) => {
        console.error('Error loading course:', err);
        // this.router.navigate(['/coursList']);
      }
    });
  }

  private loadMaterials(): void {
    this.coursService.getCourseMaterials(this.currentCourseId).subscribe({
      next: (materials) => {
        this.cours.materials = materials || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading materials:', err);
        this.isLoading = false;
      }
    });
  }

  addMaterial(): void {
    if (!this.validateBeforeAdd()) return;
  
    this.isLoading = true;
    console.log('Sending POST request to add material with URL:', this.newMaterialUrl);
  
    this.coursService.addCourseMaterial(this.currentCourseId, this.newMaterialUrl).subscribe({
      next: (response) => {
        console.log(response); 
        this.loadMaterials();
        this.newMaterialUrl = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding material:', err);
        if (err.error && err.error.message) {
          alert(`Error: ${err.error.message}`);
        } 
        this.isLoading = false;
      }
    });
  }
  
  
  private validateBeforeAdd(): boolean {
    if (!this.isTeacher) {
      alert('Only teachers can add materials');
      return false;
    }

    if (!this.newMaterialUrl?.trim()) {
      alert('Please enter a valid URL');
      return false;
    }

    if (isNaN(this.currentCourseId)) {
      console.error('Invalid course ID');
      return false;
    }

    return true;
  }
}
