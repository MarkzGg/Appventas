import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario/usuario'; // Asegúrate de importar tu interfaz Usuario
import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class EditUserModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() usuarioOriginal: Usuario | null = null; // Recibe el usuario a editar
  @Output() close = new EventEmitter<void>(); // Emite cuando se quiere cerrar
  @Output() userEdited = new EventEmitter<string>(); // Emite un mensaje al editar

  usuarioEditado: Usuario = { // Este será el modelo del formulario
    username: '',
    password: '', // La contraseña podría no ser obligatoria para la edición
    nombre: '',
    role: 'COMPRADOR'
  };
  errorMessage = ''; // Mensaje de error interno del modal

  constructor(private usuarioService: UsuarioService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioOriginal'] && this.usuarioOriginal) {
      // Cuando el usuarioOriginal cambia (es decir, se abre el modal con un nuevo usuario),
      // copiamos sus propiedades al usuarioEditado para el formulario.
      this.usuarioEditado = { ...this.usuarioOriginal };
      // Opcional: limpiar la contraseña si no la quieres mostrar o si siempre es un nuevo campo.
      this.usuarioEditado.password = '';
      this.errorMessage = ''; // Limpiar errores al cargar nuevo usuario
    }
  }

  cerrarModal(): void {
    this.close.emit();
    this.errorMessage = ''; // Limpiar errores al cerrar
  }

  guardarCambios(): void {
    this.errorMessage = '';

    if (!this.usuarioEditado.username || !this.usuarioEditado.nombre || !this.usuarioEditado.role) {
      this.errorMessage = 'Los campos de usuario, nombre y rol son obligatorios.';
      return;
    }

    this.usuarioService.editarUsuario(this.usuarioEditado).subscribe({
      next: (res) => {
        this.userEdited.emit('Usuario actualizado con éxito.');
        this.cerrarModal(); // Cerrar el modal después de guardar
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Error al actualizar usuario: ' + (err.error?.message || err.message || 'Error desconocido');
        console.error('Error al actualizar usuario:', err);
      }
    });
  }
}
