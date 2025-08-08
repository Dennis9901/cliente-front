// cliente-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Clientes Registrados</h2>
      <button class="btn btn-primary mb-2" (click)="crear()">Nuevo Cliente</button>
      <table class="table table-bordered">
        <thead>
        <tr>
          <th>Razón Social</th>
          <th>Tipo</th>
          <th>RFC</th>
          <th>Representante</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Acciones</th>
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
            <button class="btn btn-warning btn-sm" (click)="editar(cliente.id)">Editar</button>
            <button class="btn btn-danger btn-sm" (click)="eliminarCliente(cliente.id)">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  clientes: any[] = [];

  constructor(private clienteService: ClienteService,private router: Router) { }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log(data);
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
      }
    });
  }

  eliminarCliente(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => console.error('Error eliminando cliente', err)
      });
    }
  }

  crear() {
    this.router.navigate(['/clientes/nuevo']);
  }

  editar(id: number) {
    this.router.navigate(['/clientes/editar', id]);
  }
}
