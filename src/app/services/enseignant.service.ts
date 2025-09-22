import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cours } from '../modals/cours';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private apiUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) { }
  getTeacherCourses(teacherId: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/coursbyenseignant/${teacherId}`);
  }
}
