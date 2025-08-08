import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

// @ts-ignore
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule, SafeUrlPipe],
  template: `
    <div class="container">
      <h2>{{ cliente?.id ? 'Editar' : 'Nuevo' }} Cliente</h2>
      <form (ngSubmit)="guardar()" #form="ngForm">
        <input [(ngModel)]="cliente.razon_social" name="razon_social" required placeholder="Razón Social"
               class="form-control mb-2" #razonSocial="ngModel" />
        <select [(ngModel)]="cliente.tipo_persona" name="tipo_persona" required class="form-control mb-2"
                #tipoPersona="ngModel">
          <option value="Física">Física</option>
          <option value="Moral">Moral</option>
        </select>
        <input [(ngModel)]="cliente.rfc" name="rfc" required pattern="^[A-ZÑ&]{3,4}\\d{6}[A-Z\\d]{3}$"
               class="form-control mb-2" placeholder="RFC" #rfc="ngModel" />
        <input [(ngModel)]="cliente.representante_legal" name="representante_legal" required
               placeholder="Representante Legal" class="form-control mb-2" #representanteLegal="ngModel" />
        <input [(ngModel)]="cliente.email" name="email" type="email" required placeholder="Email"
               class="form-control mb-2" #email="ngModel" />
        <input [(ngModel)]="cliente.telefono" name="telefono" required pattern="^[0-9]{10}$" class="form-control mb-2"
               placeholder="Teléfono" #telefono="ngModel" />

        <input type="file" (change)="onFileSelected($event)" class="form-control mb-3" />

        <button class="btn btn-success" [disabled]="form.invalid">Guardar</button>
      </form>

      <!-- Previsualización del archivo existente -->
      <div *ngIf="archivoPreviewUrl" class="mt-3">
        <h5>Archivo actual:</h5>

        <!-- Imagen -->
        <img *ngIf="esImagen(archivoPreviewUrl)" [src]="archivoPreviewUrl" alt="Previsualización"
             style="max-width: 300px; max-height: 200px;" />

        <!-- PDF -->
        <iframe *ngIf="esPdf(archivoPreviewUrl)" [src]="archivoPreviewUrl | safeUrl" width="100%" height="400px"></iframe>

        <!-- Otro archivo -->
        <a *ngIf="!esImagen(archivoPreviewUrl) && !esPdf(archivoPreviewUrl)" [href]="archivoPreviewUrl" target="_blank">
          Ver archivo
        </a>
      </div>
    </div>
  `
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.service.getPorId(id).subscribe({
          next: data => {
            this.cliente = data;
            this.archivoPreviewUrl = data.documento || null;
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
        // No es imagen, limpia preview para evitar confusión
        this.archivoPreviewUrl = null;
      }
    } else {
      this.archivoSeleccionado = null;
      // Si el cliente tiene documento URL, mostrarlo
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
        next: () => this.router.navigate(['/clientes']),
        error: err => console.error('Error al actualizar cliente', err)
      });
    } else {
      this.service.agregar(formData).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: err => console.error('Error al crear cliente', err)
      });
    }
  }

  esImagen(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }

  esPdf(url: string): boolean {
    return /\.pdf$/i.test(url);
  }
}
