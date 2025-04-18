import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginDTO } from '../../../models/login-dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string | null = null;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      const loginData: LoginDTO = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Login failed';
          this.isSubmitting = false;
        }
      });
    }
  }
} 