import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TradeComponent } from './home/trade/trade.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { authGuardGuard } from './auth-guard.guard';
import { EditTradeComponent } from './edit-trade/edit-trade.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'login-successful', component: LoginSuccessComponent },
  { path: 'trade/:id', component: TradeComponent },
  { path: 'trade/:id/edit', component: EditTradeComponent },
  {
    path: 'add-trade',
    loadComponent: () =>
      import('./add-trade/add-trade.component').then(m => m.AddTradeComponent),
    canActivate: [authGuardGuard],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search-trade/search-trade.component').then(
        m => m.SearchTradeComponent
      ),
    canActivate: [authGuardGuard],
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./search-trade-results/search-trade-results.component').then(
        m => m.SearchTradeResultsComponent
      ),
    canActivate: [authGuardGuard],
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./user-profile/user-profile-container.component').then(
        m => m.UserProfileContainerComponent
      ),
    canActivate: [authGuardGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuardGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
