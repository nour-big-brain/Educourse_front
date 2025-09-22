import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamenService } from '../../services/examen.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.css'
})
export class ExamListComponent implements OnInit {
  coursId!: number;
  exams: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private router: Router
    
  ) {}

  ngOnInit(): void {
    this.coursId = +this.route.snapshot.paramMap.get('coursId')!;
    this.loadExams();
  }

  loadExams(): void {
    this.examenService.getExamsByCourse(this.coursId).subscribe(data => {
      this.exams = data;
    });
  }
  goToExam(examId: number): void {
    this.router.navigate(['/exam',this.coursId, examId]);
  }}