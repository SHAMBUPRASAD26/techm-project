import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'restaurants', component: RestaurantListComponent },
  { path: 'restaurants/:id', component: RestaurantDetailComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { 
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
    data: { preload: true }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 