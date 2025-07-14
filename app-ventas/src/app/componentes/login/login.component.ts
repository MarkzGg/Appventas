import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/AuthService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, // Asumiendo que es standalone
  imports: [
    FormsModule, // <-- Añadir aquí
    CommonModule // Si es necesario
  ]

})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
  console.log('LoginComponent: Iniciando proceso de login para:', this.username);
  this.authService.login({ username: this.username, password: this.password })
    .subscribe({
      next: (res: any) => {
        console.log('LoginComponent: Login exitoso. Redirigiendo...');
        this.authService.saveToken(res.token);

        // Redirección según rol
        const role = this.authService.getRole();
        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        console.error('LoginComponent: Error en el login:', err);
        this.error = 'Usuario o contraseña incorrectos';
        if (err.message) {
                this.error = err.message; // Mostrar el mensaje de error del servicio si está disponible
              }

      }
    });
}
}
