import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  listarUsuarios() {
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }

  crearUsuario(usuario: Usuario) {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  actualizarUsuario(usuario: Usuario) {
    return this.http.put<Usuario>(`${this.baseUrl}/${usuario.id}`, usuario);
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  asignarRol(username: string, rol: string) {
    return this.http.put(`${this.baseUrl}/${username}/rol`, { rol }); // Asegúrate de que la URL sea correcta
  }
  obtenerPerfil() {
    return this.http.get<Usuario>(`${this.baseUrl}/perfil`);
  }

  actualizarPerfil(usuario: Usuario) {
    return this.http.put(`${this.baseUrl}/perfil`, usuario);
  }
}
