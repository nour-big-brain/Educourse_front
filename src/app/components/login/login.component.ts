import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        if (response.includes('Logged in')) {
          const role = response.includes('STUDENT') ? 'STUDENT' : 'TEACHER';
          localStorage.setItem('userRole', role); 
          if(role=='STUDENT')
            this.router.navigate([`/coursList`]); 
          else
            this.router.navigate([`/cours`])
        }
      },
      error => {
        this.errorMessage = 'Invalid credentials';
      }
    );}

}
