import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">Gestión Clientes</a>
        <div class="ms-auto">
          <button class="btn btn-outline-light" (click)="cerrarSesion()">
            <i class="bi bi-box-arrow-right"></i> Cerrar sesión
          </button>
        </div>
      </div>
    </nav>


    <!-- Contenido principal -->
    <div class="container">
      <h2 class="mb-4">Clientes Registrados</h2>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-primary" (click)="crear()">Nuevo Cliente</button>
      </div>

      <table class="table table-striped table-bordered shadow-sm">
        <thead class="table-primary">
          <tr>
            <th>Razón Social</th>
            <th>Tipo</th>
            <th>RFC</th>
            <th>Representante</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th style="width: 140px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cliente of clientes">
            <td>{{ cliente.razon_social }}</td>
            <td>{{ cliente.tipo_persona }}</td>
            <td>{{ cliente.rfc }}</td>
            <td>{{ cliente.representante_legal }}</td>
            <td>{{ cliente.email }}</td>
            <td>{{ cliente.telefono }}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" (click)="editar(cliente.id)">
                <i class="bi bi-pencil-fill"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm" (click)="confirmarEliminar(cliente.id)">
                <i class="bi bi-trash-fill"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    table {
      min-width: 100%;
    }
    button i {
      margin-right: 4px;
    }
  `]
})
export class ClienteListComponent implements OnInit {
  public clientes: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    // suponiendo que tienes AuthService para manejar logout
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: any) => {
        this.clientes = data.data || data;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes',
        });
      }
    });
  }

  confirmarEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCliente(id);
      }
    });
  }

  eliminarCliente(id: number) {
    this.clienteService.eliminar(id).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: res.mensaje || 'Cliente eliminado exitosamente',
          });
          this.cargarClientes();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.mensaje || 'No se pudo eliminar el cliente',
          });
        }
      },
      error: (err) => {
        console.error('Error eliminando cliente', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error eliminando cliente',
        });
      }
    });
  }

  crear() {
    this.router.navigate(['/clientes/nuevo']);
  }

  editar(id: number) {
    this.router.navigate(['/clientes/editar', id]);
  }

  cerrarSesion() {
    // Aquí llama a tu AuthService para cerrar sesión
    this.authService.logout(); // o como se llame tu método
    this.router.navigate(['/login']);
  }
  volverALista() {
    this.router.navigate(['/clientes']);
  }
}
