import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario/usuario';
import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para manejar formularios

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- Añadir aquí
    FormsModule   // <-- ¡Añadir aquí!
  ],
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    username: '',
    nombre: '',
    direccion: '',
    telefono: ''
  };

  mensaje = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (data) => this.usuario = data,
      error: () => this.mensaje = 'No se pudo cargar el perfil'
    });
  }

  actualizarPerfil(): void {
    this.usuarioService.actualizarPerfil(this.usuario).subscribe({
      next: () => this.mensaje = 'Perfil actualizado con éxito',
      error: () => this.mensaje = 'Error al actualizar perfil'
    });
  }
}
