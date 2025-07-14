import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boleta } from './boleta';
import { PedidoRequest } from '../pedido-request/pedido-request';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoletaService {
  private baseUrl = `${environment.apiUrl}/boletas`;

  constructor(private http: HttpClient) {}

  generarBoleta(pedidos: PedidoRequest[]) {
    return this.http.post(`${this.baseUrl}/generar`, pedidos);
  }

  // Si implementas historial:
  obtenerHistorial() {
    return this.http.get<Boleta[]>(`${this.baseUrl}/historial`);
  }
}
