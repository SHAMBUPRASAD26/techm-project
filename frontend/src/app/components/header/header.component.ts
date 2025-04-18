import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthResponseDTO } from '../../models/auth-response-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: AuthResponseDTO | null = null;
  isLoggedIn = false;
  private authSubscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(
      (user: AuthResponseDTO | null) => this.currentUser = user
    );

    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
} 