import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario/usuario';
import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { AuthService } from 'src/app/auth/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserManagementComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensaje: string = '';
  editandoUsuario: Usuario | null = null; // Para manejar la edición de usuarios

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => this.mensaje = 'Error al cargar usuarios: ' + (err.error || err.message)
    });
  }

  crearNuevoUsuario(): void {
    this.editandoUsuario = { username: '', nombre: '', role: '' }; // Inicializa un nuevo objeto Usuario
  }

  abrirModalEditarUsuario(user: Usuario): void {
    this.editandoUsuario = { ...user }; // Clonar el usuario para editar
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado con éxito.';
          this.loadUsers();
          setTimeout(() => {
            this.mensaje = ''; // Limpiar el mensaje después de 3 segundos
          }, 3000);
        },
        error: (err) => this.mensaje = 'Error al eliminar usuario: ' + (err.error || err.message)
      });
    }
  }

  asignarRol(username: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoRol = selectElement.value;

    // Aquí deberías implementar la lógica para asignar el rol al usuario
    // Por ejemplo, podrías hacer una llamada al servicio para actualizar el rol del usuario
    this.usuarioService.asignarRol(username, nuevoRol).subscribe({
      next: () => {
        this.mensaje = `Rol de ${username} actualizado a ${nuevoRol}.`;
        this.loadUsers(); // Recargar la lista de usuarios
      },
      error: (err) => this.mensaje = 'Error al asignar rol: ' + (err.error || err.message)
    });
  }

  guardarUsuario(): void {
    if (this.editandoUsuario && this.editandoUsuario.id) {
      // Actualizar usuario existente
      this.usuarioService.actualizarUsuario(this.editandoUsuario).subscribe({
        next: () => {
          this.mensaje = 'Usuario actualizado con éxito.';
          this.loadUsers();
          this.cancelarEdicion(); // Limpiar el formulario
        },
        error: (err) => this.mensaje = 'Error al actualizar usuario: ' + (err.error || err.message)
      });
    } else if (this.editandoUsuario) {
      // Crear nuevo usuario
      this.usuarioService.crearUsuario(this.editandoUsuario).subscribe({
        next: () => {
          this.mensaje = 'Usuario creado con éxito.';
          this.loadUsers();
          this.cancelarEdicion(); // Limpiar el formulario
        },
        error: (err) => this.mensaje = 'Error al crear usuario: ' + (err.error || err.message)
      });
    }
  }

  cancelarEdicion(): void {
    this.editandoUsuario = null; // Limpiar el formulario
  }
}
