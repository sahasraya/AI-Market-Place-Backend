import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

 loginFormOtherUser: FormGroup;
  APIURL = environment.APIURL;
  message: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginFormOtherUser = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

  get isFormValid(): boolean {
    return this.loginFormOtherUser.valid;
  }

 async onSubmitLoginDetails(): Promise<void> {
    if (!this.isFormValid) {
      this.showMessage('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;

    const email = this.loginFormOtherUser.get('email')?.value || '';
    const password = this.loginFormOtherUser.get('password')?.value || '';

    this.authService.adminLogin(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.message === 'No user found') {
          this.showMessage('No user found with this email.');
        } else if (response.message === 'Invalid email or password') {
          this.showMessage('Incorrect email or password. Please try again.');
        } else if (response.message === 'Login successful') {
          // Store adminid in sessionStorage
          if (response.adminid) {
            sessionStorage.setItem('adminid', response.adminid.toString());
          }

          // Navigate to dashboard
          this.router.navigate(['/home/use-case']);
          
          // Show success message
          this.showMessage('Login successful! Welcome back.');
        } else {
          this.showMessage('Unexpected error: ' + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        
        if (error.status === 500) {
          this.showMessage('Server error. Please try again later.');
        } else {
          this.showMessage('An error occurred. Please try again.');
        }
      }
    });
  }

  createLog(userid: string): void {
    // Implement your log creation logic here
    console.log('Creating log for user:', userid);
  }
 

}
