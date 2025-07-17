    import { Component, OnInit } from '@angular/core';
    import { Usuario } from 'src/app/model/usuario/usuario';
    import { UsuarioService } from 'src/app/model/usuario/usuario.service';
    import { AuthService } from 'src/app/auth/AuthService';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    // import { ModalService } from 'src/app/services/modal.service';
    // import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component'; // Necesitarías crear este

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

      constructor(
        private usuarioService: UsuarioService,
        public authService: AuthService,
        // private modalService: ModalService
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

      abrirModalEditarUsuario(user: Usuario): void {
        // this.modalService.open(UserEditModalComponent, { user: user }).then(result => {
        //   if (result) {
        //     this.loadUsers();
        //   }
        // });
        alert('Funcionalidad de edición de usuario no implementada aún. Detalles en consola.');
        console.log('Editar usuario:', user);
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

      asignarRol(username: string,  event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const nuevoRol = selectElement.value;
        // Necesitas un endpoint en el backend para asignar rol
        // this.usuarioService.asignarRol(username, role).subscribe({
        //   next: () => {
        //     this.mensaje = `Rol de ${username} actualizado a ${role}.`;
        //     this.loadUsers();
        //   },
        //   error: (err) => this.mensaje = 'Error al asignar rol: ' + (err.error || err.message)
        // });
        alert(`Funcionalidad de asignar rol a ${username} como ${nuevoRol} no implementada aún.`);
      }
    }
