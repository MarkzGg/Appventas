import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './categoria'; // Asegúrate de que la ruta sea correcta
import { environment } from '../../../environments/environment'; // Asegúrate de la ruta correcta
@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias`; // Ajusta la URL de tu API para categorías
  constructor(private http: HttpClient) { }
  /**
   * Obtiene todas las categorías del backend.
   * @returns Un Observable con un array de Categoria.
   */
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }
  /**
   * Obtiene una categoría por su ID.
   * @param id El ID de la categoría.
   * @returns Un Observable con la Categoria.
   */
getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
  }
  /**
   * Crea una nueva categoría en el backend.
   * @param categoria La categoría a crear.
   * @returns Un Observable con la Categoria creada.
   */
  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }
  /**
   * Actualiza una categoría existente en el backend.
   * @param id El ID de la categoría a actualizar.
   * @param categoria Los datos actualizados de la categoría.
   * @returns Un Observable con la Categoria actualizada.
   */
  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }
 /**
   * Elimina una categoría del backend.
   * @param id El ID de la categoría a eliminar.
   * @returns Un Observable vacío.
   */
  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
