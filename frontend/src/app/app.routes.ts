import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { App } from './components/appComponent/app'; // seu root layout
// + dashboard futuramente...

export const routes: Routes = [
  { path: '', component: App }, // Página inicial (pode mudar depois)
  { path: 'login', component: LoginComponent },
];
