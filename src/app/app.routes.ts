import { Routes } from '@angular/router';
import { ClienteListComponent } from './components/cliente-list.component';
import { ClienteFormComponent } from './components/cliente-form.component';
import { LoginComponent } from './components/login.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clientes', component: ClienteListComponent, canActivate: [authGuard] },
  { path: 'clientes/nuevo', component: ClienteFormComponent, canActivate: [authGuard] },
  { path: 'clientes/editar/:id', component: ClienteFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
