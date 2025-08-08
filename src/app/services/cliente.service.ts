import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://127.0.0.1:5000/clientes/';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  agregar(clienteData: FormData) {
    return this.http.post(this.apiUrl, clienteData);
  }
  actualizar(cliente: any, id?: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${cliente.id}`, cliente);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  getPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }
}
