import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const email = this.forgotPasswordForm.get('email')?.value;
      
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'If an account exists with this email, a password reset link has been sent.';
          this.forgotPasswordForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Forgot password error:', error);
          // Even if there's an error, we show a success message to prevent email enumeration
          this.successMessage = 'If an account exists with this email, a password reset link has been sent.';
          this.forgotPasswordForm.reset();
        }
      });
    }
  }
} 