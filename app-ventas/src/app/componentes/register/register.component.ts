import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- Añadir aquí
    FormsModule   // <-- ¡Añadir aquí!
  ],
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
        this.error = ''; // Limpiar errores al intentar registrar
        // Validaciones de longitud en el frontend
        if (this.username.length < 4) {
          this.error = 'El nombre de usuario debe tener al menos 4 caracteres.';
          return;
        }
        if (this.password.length < 8) {
          this.error = 'La contraseña debe tener al menos 8 caracteres.';
          return;
        }
        if (this.password !== this.confirmPassword) {
          this.error = 'Las contraseñas no coinciden';
          return;
        }

    this.authService.register({ username: this.username, password: this.password })
          .subscribe({
            next: () => {
              this.error = ''; // Limpiar cualquier error previo
              this.router.navigate(['/login']);
            },
            error: (err: HttpErrorResponse) => { // Capturar el error como HttpErrorResponse
              if (err.status === 409) { // 409 Conflict
                this.error = err.error; // El cuerpo de la respuesta contiene el mensaje "El nombre de usuario ya existe."
              } else {
                this.error = 'Error al registrar el usuario. Inténtelo de nuevo.';
              }
            }
          }); // subscribe

  }

}
