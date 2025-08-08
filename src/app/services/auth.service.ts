// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private tokenKey = 'access_token';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ access_token: string }>(
      'http://127.0.0.1:5000/auth/login',
      { username, password }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.loggedIn = true;
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    // También puedes validar que el token exista y no esté expirado
    return this.loggedIn || !!localStorage.getItem(this.tokenKey);
  }
}
