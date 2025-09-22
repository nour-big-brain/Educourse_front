import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8085/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<string> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.post<string>(`${this.baseUrl}/login`, params, { responseType: 'text' as 'json' }).pipe(
      tap(response => {
        if (response.includes('Logged in')) {
          const role = response.includes('STUDENT') ? 'STUDENT' : 'TEACHER';
          localStorage.setItem('userRole', role);
          
          const idMatch = response.match(/ID:(\d+)/);
          if (idMatch) {
            if (role === 'STUDENT') {
              localStorage.setItem('etudiantId', idMatch[1]);
            } else {
              localStorage.setItem('enseignantId', idMatch[1]);
            }
          }
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/logout`, { responseType: 'text' as 'json' }).pipe(
      tap(() => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('etudiantId');
        localStorage.removeItem('enseignantId');
      })
    );
  }
  

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getEtudiantId(): number | null {
    const id = localStorage.getItem('etudiantId');
    return id ? parseInt(id, 10) : null;
  }

  getTeacherId(): number | null {
    const id = localStorage.getItem('enseignantId');
    return id ? parseInt(id, 10) : null;
  }
  
  registerStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, studentData);
  }

  // Additional useful methods
  isLoggedIn(): boolean {
    return !!this.getUserRole();
  }

  isStudent(): boolean {
    return this.getUserRole() === 'STUDENT';
  }

  isTeacher(): boolean {
    return this.getUserRole() === 'TEACHER';
  }
}