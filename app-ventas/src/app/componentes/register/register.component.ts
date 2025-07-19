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
  successMessage = '';

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
            next: (response: any) => { // <-- Asegúrate de capturar la respuesta
          this.error = ''; // Limpiar cualquier error previo
          // Puedes capturar el mensaje del backend si lo necesitas
          // this.successMessage = response; // Si el backend devuelve solo el string.
                                           // Si devuelve un objeto { message: "..." }, sería response.message
          this.successMessage = 'Usuario creado correctamente.'; // <-- ¡Mensaje de éxito deseado!
          console.log(this.successMessage); // Para depuración

          // Redirigir después de un breve retraso para que el usuario vea el mensaje
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 100); // Redirige después de 2 segundos (ajusta el tiempo si es necesario)
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
