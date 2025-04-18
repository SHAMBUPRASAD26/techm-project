import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthResponseDTO } from './models/auth-response-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FoodReviewApp';
  isLoggedIn = false;
  currentUser: AuthResponseDTO | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn
    );

    this.authService.currentUser$.subscribe(
      (user: AuthResponseDTO | null) => this.currentUser = user
    );
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 