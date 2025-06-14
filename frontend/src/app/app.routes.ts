import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TasklistComponent } from './components/tasklistComponent/tasklist';
import { App } from './components/appComponent/app'; // seu root layout
// + dashboard futuramente...

export const routes: Routes = [
  { path: '', component: App }, // Página inicial (pode mudar depois)
  { path: 'login', component: LoginComponent },
  { path: 'tasklist', component: TasklistComponent },
  { path: '**', redirectTo: 'tasklist'}
];
