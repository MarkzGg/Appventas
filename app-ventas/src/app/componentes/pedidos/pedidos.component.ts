import { Component, OnInit } from '@angular/core';
import { Boleta } from 'src/app/model/boleta/boleta';
import { BoletaService } from 'src/app/model/boleta/boleta.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Boleta[] = [];
  mensaje = '';

  constructor(private boletaService: BoletaService) {}

  ngOnInit(): void {
    this.boletaService.obtenerHistorial().subscribe({
      next: (data) => this.pedidos = data,
      error: () => this.mensaje = 'No se pudo cargar el historial de pedidos'
    });
  }

  calcularSubtotal(pedido: Boleta): number {
    return pedido.detalles.reduce((suma, d) => suma + d.subtotal, 0);
  }
}
