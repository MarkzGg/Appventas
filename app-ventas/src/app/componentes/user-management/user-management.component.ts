import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario/usuario';
import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { AuthService } from 'src/app/auth/AuthService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component'; // Importar modal de creación
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';     // ¡Importar el nuevo modal de edición!

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateUserModalComponent, // Añadir a imports
    EditUserModalComponent    // ¡Añadir a imports!
  ]
})
export class UserManagementComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensaje: string = '';
  mensajeTipo: 'exito' | 'error' | '' = '';

  // Propiedades para controlar los modales
  showCreateUserModal: boolean = false; // Controla el modal de creación
  showEditUserModal: boolean = false;   // ¡NUEVO! Controla el modal de edición
  selectedUser: Usuario | null = null;  // ¡NUEVO! Almacena el usuario a editar

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        // Opcional: limpiar el mensaje si la carga es exitosa después de una operación
        // this.mensaje = '';
        // this.mensajeTipo = '';
      },
      error: (err) => {
        this.mensaje = 'Error al cargar usuarios: ' + (err.error?.message || err.message);
        this.mensajeTipo = 'error';
      }
    });
  }

  // Lógica para el modal de CREACIÓN
  mostrarFormularioNuevoUsuario(): void {
    this.mensaje = ''; // Limpiar mensaje de la tabla principal
    this.mensajeTipo = '';
    this.showCreateUserModal = true;
  }

  onCloseCreateUserModal(): void {
    this.showCreateUserModal = false;
  }

  onUserCreated(message: string): void {
    this.mensaje = message;
    this.mensajeTipo = 'exito';
    this.loadUsers(); // Recargar la lista para ver el nuevo usuario
    setTimeout(() => { this.mensaje = ''; this.mensajeTipo = ''; }, 3000);
  }

  // Lógica para el modal de EDICIÓN
  editarUsuario(id: number): void {
    const userToEdit = this.usuarios.find(user => user.id === id);
    if (userToEdit) {
      this.selectedUser = { ...userToEdit }; // Copia profunda para no modificar el original directamente
      this.mensaje = ''; // Limpiar mensaje de la tabla principal
      this.mensajeTipo = '';
      this.showEditUserModal = true; // Mostrar el modal de edición
    }
  }

  onCloseEditUserModal(): void {
    this.showEditUserModal = false;
    this.selectedUser = null; // Limpiar el usuario seleccionado
  }

  onUserEdited(message: string): void {
    this.mensaje = message;
    this.mensajeTipo = 'exito';
    this.loadUsers(); // Recargar la lista para ver los cambios
    setTimeout(() => { this.mensaje = ''; this.mensajeTipo = ''; }, 3000);
  }

  // El método 'guardarEdicion()' y 'resetForm()' que manejaban la edición directa ya no son necesarios
  // porque la lógica se mueve al 'EditUserModalComponent'. Puedes eliminarlos si no tienen otro uso.
  /*
  guardarEdicion(): void {
      // Lógica de edición se mueve a EditUserModalComponent
  }
  resetForm(): void {
      // Lógica de reseteo se mueve a EditUserModalComponent
  }
  */

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado con éxito.';
          this.mensajeTipo = 'exito';
          this.loadUsers();
          setTimeout(() => { this.mensaje = ''; this.mensajeTipo = ''; }, 3000);
        },
        error: (err) => {
          this.mensaje = 'Error al eliminar usuario: ' + (err.error?.message || err.message);
          this.mensajeTipo = 'error';
          console.error('Error al eliminar usuario:', err);
          setTimeout(() => { this.mensaje = ''; this.mensajeTipo = ''; }, 5000);
        }
      });
    }
  }

  asignarRol(username: string, role: string): void {
    this.usuarioService.asignarRol(username, role).subscribe({
      next: () => {
        this.mensaje = `Rol de ${username} actualizado a ${role}.`;
        this.mensajeTipo = 'exito';
        this.loadUsers();
        setTimeout(() => { this.mensaje = ''; this.mensajeTipo = ''; }, 3000);
      },
      error: (err) => {
        this.mensaje = 'Error al asignar rol: ' + (err.error?.message || err.message);
        this.mensajeTipo = 'error';
      }
    });
  }
}
