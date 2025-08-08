// === auth.guard.ts ===
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('access_token');
  return !!token;  // true si hay token, false si no
};
