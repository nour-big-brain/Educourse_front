import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtudiantService } from '../../services/etudiant.service';
import { CoursService } from '../../services/cours.service';

@Component({
  selector: 'app-cours-materials',
  standalone: true,
  imports: [],
  templateUrl: './cours-materials.component.html',
  styleUrl: './cours-materials.component.css'
})
export class CoursMaterialsComponent implements OnInit {
  coursId!: number;
  materials: string[] = [];
  coursTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private etudiantService: EtudiantService,
    private coursService:CoursService
  ) {}

  ngOnInit(): void {
    this.coursId = +this.route.snapshot.params['coursId'];
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.coursService.getCourseMaterials(this.coursId).subscribe({
      next: (materials) => {
        this.materials = materials || [];
      },
      error: (err) => console.error('Error loading materials', err)
    });
  }

  isPdfMaterial(material: string): boolean {
    return material.toLowerCase().endsWith('.pdf');
  }

  isVideoMaterial(material: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];
    return videoExtensions.some(ext => material.toLowerCase().endsWith(ext));
  }
}