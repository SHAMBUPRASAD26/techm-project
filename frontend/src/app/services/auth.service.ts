import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterDTO } from '../models/register-dto';
import { AuthResponseDTO } from '../models/auth-response-dto';
import { ForgotPasswordDTO } from '../models/forgot-password-dto';

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<AuthResponseDTO | null>;
  public currentUser$: Observable<AuthResponseDTO | null>;
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthResponseDTO | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!storedUser);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  public getHeaders(): HttpHeaders {
    const token = this.getToken();
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  register(registerDto: RegisterDTO): Observable<AuthResponseDTO> {
    console.log('Registering user with data:', registerDto);
    return this.http.post<AuthResponseDTO>(
      `${this.apiUrl}/auth/register`,
      registerDto,
      {
        headers: this.getHeaders(),
        withCredentials: true
      }
    ).pipe(
      tap({
        next: (response) => console.log('Registration successful:', response),
        error: (error) => {
          console.error('Registration error:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
        }
      })
    );
  }

  login(loginDto: any): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(
      `${this.apiUrl}/auth/login`,
      loginDto,
      {
        headers: this.getHeaders(),
        withCredentials: true,
        observe: 'response' as const
      }
    ).pipe(
      map(response => {
        if (response.body) {
          this.setUser(response.body);
          return response.body;
        }
        throw new Error('No response body');
      })
    );
  }

  private setUser(user: AuthResponseDTO | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      this.currentUserSubject.next(null);
      this.isLoggedInSubject.next(false);
    }
  }

  logout(): void {
    this.setUser(null);
  }

  forgotPassword(email: string): Observable<any> {
    const forgotPasswordDto: ForgotPasswordDTO = { email };
    return this.http.post<any>(
      `${this.apiUrl}/auth/forgot-password`,
      forgotPasswordDto,
      {
        headers: this.getHeaders(),
        withCredentials: true
      }
    ).pipe(
      tap({
        next: (response) => {
          console.log('Forgot password request successful:', response);
          if (!response.message) {
            response.message = 'If an account exists with this email, a password reset link has been sent.';
          }
        },
        error: (error) => {
          console.error('Forgot password error:', error);
          if (error.error) {
            console.error('Error details:', error.error);
            // If the error is a 400 Bad Request, we still want to show a success message
            // to prevent email enumeration
            if (error.status === 400) {
              throw new Error('If an account exists with this email, a password reset link has been sent.');
            }
          }
          throw error;
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  resetPassword(resetPasswordDto: ResetPasswordDTO) {
    console.log('Attempting to reset password with token:', resetPasswordDto.token);
    return this.http.post(`${this.apiUrl}/auth/reset-password`, resetPasswordDto, {
      headers: this.getHeaders(),
      withCredentials: true
    }).pipe(
      tap({
        next: (response) => console.log('Password reset successful:', response),
        error: (error) => {
          console.error('Password reset error:', error);
          if (error.error) {
            console.error('Error details:', error.error);
          }
          throw error;
        }
      })
    );
  }
}
