import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  student = {
    emailEtud: '',
    password: '',
    nomEtud: '',
    dateNaissance: '',  // Added missing value
    niveau: '',
    role: 'STUDENT'
  };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.authService.registerStudent(this.student).subscribe({
      next: (response: any) => {
        if (response.text) {
          // Handle success case even if it comes as text
          this.message = response.text;
          this.router.navigate(['/login']);
        } else {
          this.message = 'Student registered successfully!';
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        if (error.error?.text) {
          // If the error contains a success message
          this.message = error.error.text;
          this.router.navigate(['/login']);
        } else if (error.error?.message) {
          this.message = 'Error during registration: ' + error.error.message;
        } else {
          this.message = 'Error during registration: ' + JSON.stringify(error.error);
        }
      }
    });
  }
}