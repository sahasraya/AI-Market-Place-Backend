import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

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
    private http: HttpClient,
    private route: Router
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
    this.route.navigate(['/home/dashboard']);
    if (!this.isFormValid) {
      return;
    }

    this.isLoading = true;
    const email = this.loginFormOtherUser.get("email")?.value || '';
    const password = this.loginFormOtherUser.get("password")?.value || '';

    const formData = new FormData();
    formData.append("emailaddress", email);
    formData.append("password", password);

    this.http.post(this.APIURL + 'user_log_in', formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        if (response.message === "Please confirm the email") {
          this.showMessage('Please confirm your email before logging in.');
        } else if (response.message === "No user found") {
          this.showMessage('No user found with this email.');
        } else if (response.message === "Invalid email or password") {
          this.showMessage('Incorrect password. Please try again.');
        } else if (response.message === "Login successful") {
          sessionStorage.setItem('adminid', response.userid);
          this.route.navigate(['/home/dashboard']);
        } else {
          this.showMessage("Unexpected error: " + response.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        this.showMessage("Server error. Please try again.");
      }
    });
  }

  createLog(userid: string): void {
    // Implement your log creation logic here
    console.log('Creating log for user:', userid);
  }
 

}
