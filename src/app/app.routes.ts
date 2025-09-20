import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TradeComponent } from './home/trade/trade.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { authGuardGuard } from './auth-guard.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'login-successful', component: LoginSuccessComponent },
  { path: 'trade/:id', component: TradeComponent },
  {
    path: 'add-trade',
    loadComponent: () =>
      import('./add-trade/add-trade.component').then(m => m.AddTradeComponent),
    canActivate: [authGuardGuard],
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./user-profile/user-profile-container.component').then(
        m => m.UserProfileContainerComponent
      ),
    canActivate: [authGuardGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [authGuardGuard]
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
