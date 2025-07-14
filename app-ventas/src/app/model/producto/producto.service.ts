import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getProductos() {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  getProducto(id: number) {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  crearProducto(producto: Producto) {
    return this.http.post<Producto>(this.baseUrl, producto);
  }

  actualizarProducto(producto: Producto) {
    return this.http.put<Producto>(`${this.baseUrl}/${producto.id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  searchProductos(keyword: string) {
    return this.http.get<Producto[]>(`${this.baseUrl}/buscar?keyword=${keyword}`);
  }

  getProductosBajoStock() {
    return this.http.get<Producto[]>(`${this.baseUrl}/bajo-stock`);
  }
}
