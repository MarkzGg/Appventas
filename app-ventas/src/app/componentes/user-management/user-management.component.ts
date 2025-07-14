import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario/usuario';
import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { AuthService } from 'src/app/auth/AuthService'; // Para verificar roles

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  usuarios: Usuario[] = [];
  mensaje: string = '';

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService // Para controlar la visibilidad de acciones
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

  editarUsuario(id: number): void {
    // Lógica para navegar al formulario de edición de usuario
    // Podría ser un modal o una nueva ruta como /admin/usuarios/editar/:id
    alert('Funcionalidad de edición de usuario no implementada aún.');
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado con éxito.';
          this.loadUsers(); // Recargar la lista
        },
        error: (err) => this.mensaje = 'Error al eliminar usuario: ' + (err.error || err.message)
      });
    }
  }

  // Método para asignar rol (solo ADMIN)
  asignarRol(username: string, role: string): void {
    alert(`Funcionalidad de asignar rol a ${username} como ${role} no implementada aún.`);
    // Aquí llamarías a un servicio que interactúe con el endpoint /admin/asignar-rol
  }
}
