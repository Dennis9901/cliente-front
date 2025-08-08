// === login.component.ts ===
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <input type="text" [(ngModel)]="username" name="username" placeholder="Usuario" required class="form-control mb-2">
        <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" required class="form-control mb-2">
        <button class="btn btn-primary">Entrar</button>
      </form>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(success => {
      console.log(success);
      if (success) {
        this.router.navigate(['/clientes']);
      } else {
        alert('Credenciales inválidas');
      }
    });
  }
}
