import { Component, OnInit } from '@angular/core';
import { Cours } from '../../modals/cours';
import { CoursService } from '../../services/cours.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-cours',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-cours.component.html',
  styleUrl: './edit-cours.component.css'
})
export class EditCoursComponent implements OnInit {
  cours: Cours = {
    titre_cours: '',
    duree_cours: 0
  };

  constructor(
    private coursService: CoursService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.coursService.getCoursById(id).subscribe(data => {
      this.cours = data;
    });
  }

  updateCours(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.coursService.updateCours(id, this.cours).subscribe(() => {
      this.router.navigate(['/cours']);
    });
  }
}