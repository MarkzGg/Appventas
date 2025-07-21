import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/AuthService';

@Injectable({
  providedIn: 'root'
})
export class AdminOrUserGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && (this.authService.isAdmin() || this.authService.isUser())) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
