import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from './reseña';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private baseUrl = `${environment.apiUrl}/resenas`;
  http: any;


  getAllResenas(): Observable<Resena[]> {
    return this.http.get( `${this.baseUrl}/listar`);// Asumiendo que GET /reseñas lista todas
  }
  // Método para aprobar una reseña
  aprobar(id: number): Observable<string> {
    // El backend tiene PUT /reseñas/moderar/{id}
    return this.http.put(`${this.baseUrl}/moderar/${id}`, {}, { responseType: 'text' });
  }
  // Método para rechazar/eliminar una reseña (asumiendo un endpoint en el backend)
  // El backend no tiene un endpoint DELETE para reseñas en el contexto,
  // pero si se "rechaza" una reseña, a menudo se elimina.
  eliminar(id: number): Observable<string> {
    // Asumiendo un endpoint DELETE /reseñas/{id}
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
  // Método para crear una reseña (para el COMPRADOR)
  crearResena(resena: Resena): Observable<string> {
    // El backend tiene POST /reseñas/crear
    return this.http.post(`${this.baseUrl}/crear`, resena, { responseType: 'text' });
  }
}
