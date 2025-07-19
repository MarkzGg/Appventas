import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario/usuario'; // Asegúrate de importar tu interfaz Usuario
import { UsuarioService } from 'src/app/model/usuario/usuario.service'; // Asegúrate de importar tu servicio
import { HttpErrorResponse } from '@angular/common/http'; // Para manejar errores

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class CreateUserModalComponent implements OnInit {
  @Input() visible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<void>(); // Emite cuando se quiere cerrar el modal
  @Output() userCreated = new EventEmitter<string>(); // Emite un mensaje al crear usuario

  nuevoUsuario: Usuario = {
    username: '',
    password: '',
    nombre: '',
    role: 'COMPRADOR' // Rol predeterminado
  };
  confirmPassword = '';
  errorMessage = ''; // Mensaje de error interno del modal

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // Al inicializar o cuando el modal se hace visible, puedes resetear el formulario
    this.resetForm();
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.resetForm(); // Limpiar formulario al cerrar
    this.close.emit(); // Emitir evento para que el padre lo oculte
  }

  crearUsuario(): void {
    this.errorMessage = ''; // Limpiar errores previos

    if (!this.nuevoUsuario.username || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre || !this.nuevoUsuario.role) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.nuevoUsuario.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        this.userCreated.emit('Usuario creado con éxito.'); // Emitir mensaje de éxito al padre
        this.cerrarModal(); // Cerrar el modal después de crear
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) { // Conflicto: Usuario ya existe
          this.errorMessage = 'El nombre de usuario ya existe.';
        } else {
          this.errorMessage = 'Error al crear usuario: ' + (err.error?.message || err.message || 'Error desconocido');
        }
        console.error('Error al crear usuario:', err);
      }
    });
  }

  resetForm(): void {
    this.nuevoUsuario = { username: '', password: '', nombre: '', role: 'COMPRADOR' };
    this.confirmPassword = '';
    this.errorMessage = '';
  }
}
