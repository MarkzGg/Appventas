import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from './marca'; // Asegúrate de que la interfaz Marca esté bien definida
import { environment } from '../../../environments/environment'; // Asegúrate de la ruta correcta

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class MarcaService {
  private apiUrl = `${environment.apiUrl}/marcas`; // Ajusta la URL de tu API

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl);
  }

  getMarca(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`);
  }

  createMarca(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca);
  }

  updateMarca(id: number, marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${id}`, marca);
  }

  deleteMarca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
