import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterDTO } from '../../../models/register-dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  error: string | null = null;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
    // Log form state changes for debugging
    this.registerForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form errors:', this.registerForm.errors);
      console.log('Form value:', this.registerForm.value);
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get username() { return this.registerForm.get('username')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.error = null;

      const registerData: RegisterDTO = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        confirmPassword: this.registerForm.get('confirmPassword')?.value,
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.error = error.error.message || 'Registration failed';
          this.isSubmitting = false;
        }
      });
    } else {
      // Log form errors for debugging
      console.log('Form is invalid');
      console.log('Form errors:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          console.log(`${key} errors:`, control.errors);
        }
      });
    }
  }
} 