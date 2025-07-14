import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/AuthService';

@Injectable({ providedIn: 'root' })
export class UserAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && (this.authService.isUser() || this.authService.isAdmin())) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
