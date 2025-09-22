import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Examen } from '../modals/examen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

   private baseUrl = 'http://localhost:8085/examens'; 
   private baseUrlDeux = 'http://localhost:8085/cours'; 


  constructor(private http: HttpClient) {}

  saveExamen(examen: Examen): Observable<Examen> {
    return this.http.post<Examen>(this.baseUrl, examen);
  }

  scheduleExamen(id: number, date: Date): Observable<Examen> {
    return this.http.put<Examen>(`${this.baseUrl}/${id}/schedule`, null, { params: { date: date.toISOString() } });
  }

  assignEtudiantToExamen(idExam: number, idEtud: number): Observable<Examen> {
    return this.http.put<Examen>(`${this.baseUrl}/${idExam}/assign/${idEtud}`, null);
  }

  getStudentExamResult(idEtud: number, idExam: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${idExam}/result/${idEtud}`);
  }

  getAllExams(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.baseUrl);
  }
  getExamsByCourse(coursId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlDeux}/${coursId}/exams`);
  }
  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${examId}`);
  }
}
