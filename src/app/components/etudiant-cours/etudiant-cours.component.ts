import { Component, OnInit } from '@angular/core';
import { Cours } from '../../modals/cours';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../services/etudiant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-etudiant-cours',
  standalone: true,
  imports: [],
  templateUrl: './etudiant-cours.component.html',
  styleUrl: './etudiant-cours.component.css'
})
export class EtudiantCoursComponent implements OnInit{
  etudiantId!: number;
  coursList: Cours[] = [];

  constructor(
    private route: ActivatedRoute,
    private etudiantService: EtudiantService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.etudiantId = this.authService.getEtudiantId()!;
    this.loadEtudiantCours();
  }

  loadEtudiantCours(): void {
    this.etudiantService.getEtudiantCours(this.etudiantId).subscribe(data => {
      this.coursList = data;
    });
  }

  viewMaterials(coursId: number): void {
    this.router.navigate(['/cours', coursId, 'materials']);
  }
  
  takeExam(coursId: number): void {
    this.router.navigate([`/cours/${coursId}/exams`]);  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}