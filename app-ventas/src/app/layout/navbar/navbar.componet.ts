import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/AuthService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
      standalone: true, // <--- ¡Añadir esto!
      imports: [
        CommonModule,
        RouterModule // <--- ¡Añadir esto!
      ]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  currentYear = new Date().getFullYear();
  logout() {
    this.authService.logout();
  }
}
