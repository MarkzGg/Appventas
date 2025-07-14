import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './usuario';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  obtenerPerfil() {
    return this.http.get<Usuario>(`${this.baseUrl}/perfil`);
  }

  actualizarPerfil(usuario: Usuario) {
    return this.http.put(`${this.baseUrl}/perfil`, usuario);
  }

  listarUsuarios() {
  return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
}
  eliminarUsuario(id: number) {
    return this.http.delete(`${this.baseUrl}/eliminar/${id}`);
  }

  buscarUsuarios(keyword: string) {
    return this.http.get<Usuario[]>(`${this.baseUrl}/buscar?keyword=${keyword}`);
  }
}
