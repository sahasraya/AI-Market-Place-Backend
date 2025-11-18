// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

interface LoginResponse {
  message: string;
  adminid?: number;
  userid?: number;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user_info?: {
    adminid?: number;
    userid?: number;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private APIURL = 'http://localhost:8000/'; // Your API URL
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    const token = this.getToken();
    if (token) {
      this.loadUserFromToken();
    }
  }

  // ✅ Admin Login
  adminLogin(email: string, password: string): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('emailaddress', email);
    formData.append('password', password);

    return this.http.post<LoginResponse>(this.APIURL + 'admin_log_in', formData);
  }

  // ✅ User Login
  userLogin(email: string, password: string): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('emailaddress', email);
    formData.append('password', password);

    return this.http.post<LoginResponse>(this.APIURL + 'user_log_in', formData);
  }

  // ✅ Store JWT Token
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // ✅ Get JWT Token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // ✅ Store User Info
  setUserInfo(userInfo: any): void {
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    this.currentUserSubject.next(userInfo);
  }

  // ✅ Get User Info
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // ✅ Load User from Token
  private loadUserFromToken(): void {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      this.currentUserSubject.next(userInfo);
    }
  }

  // ✅ Check if User is Logged In
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ✅ Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ✅ Get Authorization Headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}