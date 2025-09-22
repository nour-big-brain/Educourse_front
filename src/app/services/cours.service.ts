import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { Cours } from '../modals/cours';
import { Examen } from '../modals/examen';

import { Enseignant } from '../modals/enseignant';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private baseUrl = 'http://localhost:8085/cours';
  private examUrl = 'http://localhost:8085/examens';
  private enseignantUrl='http://localhost:8085/enseignants'


  constructor(private http: HttpClient) {}

  // saveCours(cours: Cours): Observable<Cours> {
  //   return this.http.post<Cours>(this.baseUrl, cours);
  // }
  saveCoursWithImage(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8085/cours', formData);
  }

  getAllCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.baseUrl);
  }
  updateCours(id: number, cours: Cours): Observable<Cours> {
    
    return this.http.put<Cours>(`${this.baseUrl}/${id}`, cours);
  }

  deleteCours(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCoursById(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.baseUrl}/${id}`);
  }

 
  addCourseMaterial(coursId: number, materialUrl: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${coursId}/materials`, materialUrl, { responseType: 'json' });
  }
  
  getCourseMaterials(coursId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${coursId}/materials`);
  }
  
  createAndAssignExam(coursId: number, examen: any) {
    return this.http.post<Examen>(this.examUrl, examen).pipe(
      switchMap((createdExam) => {
        return this.http.post<Cours>(`${this.baseUrl}/${coursId}/exams/${createdExam.idEx}`, {}).pipe(
          map(() => createdExam) 
        );
      })
    );

  }
  assignCourseToTeacher(teacherId: number, courseId: number): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.enseignantUrl}/${teacherId}/cours/${courseId}`, {});
  }
  
  
  
}
