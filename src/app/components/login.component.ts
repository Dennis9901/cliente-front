import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card shadow-sm p-4" style="width: 360px;">
        <h3 class="text-center mb-4">Iniciar Sesión</h3>

        <form (ngSubmit)="login()">
          <div class="mb-3">
            <label for="username" class="form-label">Usuario</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Usuario"
              required
              class="form-control"
              autofocus
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Contraseña"
              required
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>

        <small class="text-muted d-block text-center mt-3">
          © 2025 Clients
        </small>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 12px;
    }
  `]
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Credenciales inválidas',
          confirmButtonColor: '#3085d6',
        });      }
    });
  }
}
