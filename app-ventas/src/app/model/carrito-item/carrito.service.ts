import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarritoItem } from './carrito-item';
import { PedidoRequest } from '../pedido-request/pedido-request';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private baseUrl = `${environment.apiUrl}/carrito`;

  constructor(private http: HttpClient)
        {}

  obtenerCarrito() {
    return this.http.get<CarritoItem[]>(this.baseUrl);
  }

  limpiarCarrito() {
    return this.http.delete(`${this.baseUrl}/limpiar`);
  }

  agregarProducto(pedido: PedidoRequest) {
    return this.http.post(`${this.baseUrl}/agregar`, pedido);
  }
}
