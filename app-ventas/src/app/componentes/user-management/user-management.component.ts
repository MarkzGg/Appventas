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
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class UserManagementComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensaje: string = '';

  nuevoUsuario: Usuario = {
    username: '',
    password: '',
    nombre: '', // Asegúrate de que el nombre esté aquí
    role: 'COMPRADOR'
  };
  confirmNewPassword = '';
    isCreating: boolean = false; // Variable para controlar la visibilidad del formulario de creación
    isEditing: boolean = false; // Variable para controlar la visibilidad del formulario de edición


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
       this.mensaje = '';

       if (!this.nuevoUsuario.username || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre || !this.nuevoUsuario.role) {
           this.mensaje = 'Todos los campos son obligatorios.';
           return;
       }

       if (this.nuevoUsuario.password !== this.confirmNewPassword) {
           this.mensaje = 'Las contraseñas no coinciden.';
           return;
       }

       this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
           next: (res) => {
               this.mensaje = 'Usuario creado con éxito.';
                this.loadUsers();
                this.resetForm();
           },
           error: (err) => {
               this.mensaje = 'Error al crear usuario: ' + (err.error || err.message);
           }
       });
   }


  editarUsuario(id: number): void {
        const usuarioAEditar = this.usuarios.find(user => user.id === id);
        if (usuarioAEditar) {
            this.nuevoUsuario = { ...usuarioAEditar }; // Cargar los datos del usuario en el formulario
            this.isEditing = true; // Activar el modo de edición
        }
    }
guardarEdicion(): void {
        this.usuarioService.editarUsuario(this.nuevoUsuario).subscribe({
            next: () => {
                this.mensaje = 'Usuario actualizado con éxito.';
                this.loadUsers(); // Recargar la lista de usuarios
                this.resetForm();
            },
            error: (err) => {
                this.mensaje = 'Error al actualizar usuario: ' + (err.error || err.message);
            }
        });
    }
    resetForm(): void {
        this.nuevoUsuario = { username: '', password: '', nombre: '', role: 'COMPRADOR' };
        this.confirmNewPassword = '';
        this.isCreating = false; // Ocultar el formulario de creación
        this.isEditing = false; // Ocultar el formulario de edición
         this.mensaje = '';
    }
    mostrarFormularioNuevoUsuario() {
  this.resetForm();
  this.isCreating = true;
}


  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado con éxito.';
          this.loadUsers();
        },
        error: (err) => this.mensaje = 'Error al eliminar usuario: ' + (err.error || err.message)
      });
    }
  }

  asignarRol(username: string, role: string): void {
    this.usuarioService.asignarRol(username, role).subscribe({
      next: () => {
        this.mensaje = `Rol de ${username} actualizado a ${role}.`;
        this.loadUsers();
      },
      error: (err) => this.mensaje = 'Error al asignar rol: ' + (err.error || err.message)
    });
  }
}
