import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boleta } from './boleta';
import { PedidoRequest } from '../pedido-request/pedido-request';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/AuthService';

@Injectable({ providedIn: 'root' })
export class BoletaService {

  private apiUrl = `${environment.apiUrl}/boletas`;

  private baseUrl = `${environment.apiUrl}/boletas`;

  constructor(private http: HttpClient, private authService: AuthService) {}
   // Asegúrate de que AuthService esté correctamente inyectado

  generarBoleta(pedidos: PedidoRequest[]) {
    return this.http.post(`${this.baseUrl}/generar`, pedidos);
  }

  getAllBoletasForAdmin(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/admin/todas`); // Llama al nuevo endpoint
  }

  deleteBoleta(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  deleteBoletaConPedido(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar-con-pedido/${id}`, { responseType: 'text' });
  }

  // Si implementas historial:
  obtenerHistorial() {
    return this.http.get<Boleta[]>(`${this.baseUrl}/historial`);
  }

  descargarBoletaPdf(boletaId: number): Observable<Blob> {
    // Es crucial que el responseType sea 'blob' para manejar correctamente el archivo binario.
    // Si tu backend requiere algún encabezado (ej. token de autenticación), añádelo aquí.
    const headers = new HttpHeaders({
      // 'Authorization': 'Bearer ' + tuTokenDeAutenticacion, // Ejemplo si usas token
      'Accept': 'application/pdf' // Indica que esperas un PDF
    });

    return this.http.get(`${this.apiUrl}/${boletaId}/pdf`, {
      responseType: 'blob', // MUY IMPORTANTE: para recibir el archivo binario
      headers: headers
    });
  }
}
