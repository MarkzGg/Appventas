import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = environment.apiUrl + '/pedidos';

  constructor(private http: HttpClient) {}

  obtenerHistorial(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/historial');
  }

  crearPedido(pedidos: any): Observable<any> {
    return this.http.post(this.baseUrl + '/crear', pedidos);
  }
}
