import { Component, OnInit } from '@angular/core';
import { Cours } from '../../modals/cours';
import { CoursService } from '../../services/cours.service';
import { EtudiantService } from '../../services/etudiant.service';
import { AuthService } from '../../services/auth.service';
import { EnseignantService } from '../../services/enseignant.service'; // Import EnseignantService
import { Router } from '@angular/router';

@Component({
  selector: 'app-cours-list',
  standalone: true,
  imports: [],
  templateUrl: './cours-list.component.html',
  styleUrl: './cours-list.component.css'
})
export class CoursListComponent implements OnInit {
  coursList: Cours[] = [];
  isTeacher: boolean = false;
  etudiantId: number | null = null;
  loggedIn = false;
  signedUpCourses: number[] = []; 

  constructor(
    private coursService: CoursService,
    private etudiantService: EtudiantService,
    private authService: AuthService,
    private enseignantService: EnseignantService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.etudiantId = this.authService.getEtudiantId();
    this.checkUserRole();
    this.loadCours();
    this.loggedIn = this.authService.isLoggedIn();
    if (this.etudiantId) {
      this.loadSignedUpCourses();
    }
  }

  loadCours(): void {
    if (this.isTeacher) {
      const teacherId = this.authService.getTeacherId(); 
      if (teacherId !== null) {
        this.enseignantService.getTeacherCourses(teacherId).subscribe(data => {
          this.coursList = data;
        });
      } else {
        console.error('🚨 Teacher ID is missing in local storage!');
      }
    } else {
      this.coursService.getAllCours().subscribe(data => {
        this.coursList = data; 
      });
    }
  }

  loadSignedUpCourses(): void {
    if (this.etudiantId) {
      this.etudiantService.getEtudiantCours(this.etudiantId).subscribe(data => {
        this.signedUpCourses = data.map(cours => cours.idCours); 
      });
    }
  }

  deleteCours(id: number): void {
    if (this.isTeacher) {
      this.coursService.deleteCours(id).subscribe(() => {
        this.loadCours(); 
      });
    }
  }

  signUp(cours: Cours): void {
    const etudiantId = this.authService.getEtudiantId();
    const coursId = cours.idCours;

    if (etudiantId && coursId) {
      this.etudiantService.signUpForCourse(etudiantId, coursId).subscribe(
        response => {
          console.log('✅ Sign-up successful:', response);
          this.signedUpCourses.push(coursId); 
        },
        error => {
          console.error('❌ Sign-up failed:', error);
        }
      );
    } else {
      console.error('🚨 Student ID or Course ID is missing!');
    }
  }

  checkUserRole(): void {
    const role = this.authService.getUserRole();
    this.isTeacher = role === 'TEACHER';
  }

  isSignedUp(coursId: number): boolean {
    return this.signedUpCourses.includes(coursId);
  }
}