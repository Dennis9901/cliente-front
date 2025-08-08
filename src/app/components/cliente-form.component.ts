import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


import Swal from 'sweetalert2';


@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">Gestión Clientes</a>
        <div class="ms-auto">
          <button class="btn btn-outline-light" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i> Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
    <div class="container mb-3">
      <button class="btn btn-secondary" (click)="volverALista()">
        <i class="bi bi-arrow-left"></i> Volver a la lista
      </button>
    </div>

    <div class="container">
      <h2 class="mb-4">{{ cliente?.id ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>

      <form (ngSubmit)="guardar()" #form="ngForm" novalidate>
        <div class="mb-3">
          <label for="razonSocial" class="form-label">Razón Social</label>
          <input id="razonSocial" [(ngModel)]="cliente.razon_social" name="razon_social" required
            placeholder="Razón Social" class="form-control" #razonSocial="ngModel" />
          <div *ngIf="razonSocial.invalid && razonSocial.touched" class="text-danger">
            Razón Social es requerida.
          </div>
        </div>

        <div class="mb-3">
          <label for="tipoPersona" class="form-label">Tipo de Persona</label>
          <select id="tipoPersona" [(ngModel)]="cliente.tipo_persona" name="tipo_persona" required
            class="form-select" #tipoPersona="ngModel">
            <option value="Física">Física</option>
            <option value="Moral">Moral</option>
          </select>
          <div *ngIf="tipoPersona.invalid && tipoPersona.touched" class="text-danger">
            Seleccione un tipo válido.
          </div>
        </div>

        <div class="mb-3">
          <label for="rfc" class="form-label">RFC</label>
          <input id="rfc" [(ngModel)]="cliente.rfc" name="rfc" required
            pattern="^[A-ZÑ&]{3,4}\\d{6}[A-Z\\d]{3}$" placeholder="RFC" class="form-control" #rfc="ngModel" />
          <div *ngIf="rfc.invalid && rfc.touched" class="text-danger">
            RFC inválido o requerido.
          </div>
        </div>

        <div class="mb-3">
          <label for="representanteLegal" class="form-label">Representante Legal</label>
          <input id="representanteLegal" [(ngModel)]="cliente.representante_legal" name="representante_legal" required
            placeholder="Representante Legal" class="form-control" #representanteLegal="ngModel" />
          <div *ngIf="representanteLegal.invalid && representanteLegal.touched" class="text-danger">
            Este campo es requerido.
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" [(ngModel)]="cliente.email" name="email" type="email" required placeholder="Email"
            class="form-control" #email="ngModel" />
          <div *ngIf="email.invalid && email.touched" class="text-danger">
            Email inválido o requerido.
          </div>
        </div>

        <div class="mb-3">
          <label for="telefono" class="form-label">Teléfono</label>
          <input id="telefono" [(ngModel)]="cliente.telefono" name="telefono" required pattern="^[0-9]{10}$"
            placeholder="Teléfono" class="form-control" #telefono="ngModel" />
          <div *ngIf="telefono.invalid && telefono.touched" class="text-danger">
            Teléfono inválido (10 dígitos) o requerido.
          </div>
        </div>

        <div class="mb-4">
          <label for="documento" class="form-label">Documento (archivo)</label>
          <input id="documento" type="file" (change)="onFileSelected($event)" class="form-control" />
        </div>

        <button class="btn btn-success" [disabled]="form.invalid">
          {{ cliente?.id ? 'Actualizar' : 'Guardar' }}
        </button>
      </form>

      <div *ngIf="archivoPreviewUrl" class="mt-4">
        <h5>Archivo actual:</h5>

        <img *ngIf="esImagen(archivoPreviewUrl)" [src]="archivoPreviewUrl" alt="Previsualización"
          style="max-width: 300px; max-height: 200px;" class="img-thumbnail" />

        <iframe *ngIf="esPdf(archivoPreviewUrl)" [src]="archivoPreviewUrl | safeUrl" width="100%" height="400px"
          class="border rounded"></iframe>

        <a *ngIf="!esImagen(archivoPreviewUrl) && !esPdf(archivoPreviewUrl)" [href]="archivoPreviewUrl" target="_blank"
          class="btn btn-link">
          Ver archivo
        </a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;
    }
  `]
})
export class ClienteFormComponent implements OnInit {
  cliente: any = {
    id: null,
    razon_social: '',
    tipo_persona: 'Física',
    rfc: '',
    representante_legal: '',
    email: '',
    telefono: '',
    documento: ''
  };
  archivoSeleccionado: File | null = null;
  archivoPreviewUrl: string | null = null;

  constructor(
    private service: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.service.getPorId(id).subscribe({
          next: data => {
            console.log(data);
            this.cliente = data.data;
            this.archivoPreviewUrl = data.data.url_documento || null;
          },
          error: err => {
            console.error('Error al cargar cliente', err);
          }
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.archivoSeleccionado = target.files[0];

      if (this.archivoSeleccionado.type.startsWith('image/')) {
        this.archivoPreviewUrl = URL.createObjectURL(this.archivoSeleccionado);
      } else {
        this.archivoPreviewUrl = null;
      }
    } else {
      this.archivoSeleccionado = null;
      this.archivoPreviewUrl = this.cliente.documento || null;
    }
  }

  guardar() {
    const formData = new FormData();

    formData.append('razon_social', this.cliente.razon_social);
    formData.append('tipo_persona', this.cliente.tipo_persona);
    formData.append('rfc', this.cliente.rfc);
    formData.append('representante_legal', this.cliente.representante_legal);
    formData.append('email', this.cliente.email);
    formData.append('telefono', this.cliente.telefono);

    if (this.archivoSeleccionado) {
      formData.append('documento', this.archivoSeleccionado);
    }

    if (this.cliente.id) {
      this.service.actualizar(formData, this.cliente.id).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res?.mensaje || 'Cliente actualizado correctamente',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          const msg = err?.error?.mensaje || 'Error al actualizar cliente';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg
          });
        }
      });
    } else {
      this.service.agregar(formData).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res?.mensaje || 'Cliente creado correctamente',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          const msg = err?.error?.mensaje || 'Error al crear cliente';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg
          });
        }
      });
    }
  }

  esImagen(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }

  esPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  logout() {
    this.authService.logout();
  }
  volverALista() {
    this.router.navigate(['/clientes']);
  }
}
