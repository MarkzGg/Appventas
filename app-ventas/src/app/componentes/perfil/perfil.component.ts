import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario/usuario';
import { UsuarioService } from 'src/app/model/usuario/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    username: '',
    nombreCompleto: '',
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
