import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cours } from '../modals/cours';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private baseUrl = 'http://localhost:8085/etudiants'; 

  constructor(private http: HttpClient) {}

  getEtudiantCours(id: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.baseUrl}/${id}/cours`);
  }
  signUpForCourse(etudiantId: number, coursId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${etudiantId}/signup/${coursId}`, {});
  }
  getCoursMaterials(coursId: number): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8085/cours/${coursId}/materials`);
  }
}

