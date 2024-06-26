import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TradeComponent } from './home/trade/trade.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'trade/:id', component: TradeComponent },
  {
    path: 'add-trade',
    loadComponent: () =>
      import('./add-trade/add-trade.component').then(
        (m) => m.AddTradeComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
