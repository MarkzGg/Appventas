import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/model/pedido/pedido.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderDetailModalComponent } from './order-detail-modal.component'; // Mantener este
import { Boleta } from 'src/app/model/boleta/boleta';
// import { BoletaPdfModalComponent } from './boleta-pdf-modal.component'; // ¡ELIMINAR esta importación!

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, OrderDetailModalComponent] // Eliminar BoletaPdfModalComponent
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  mensaje = '';
  // showModal = false; // Eliminar si no se usa
  showDetailModal = false;
  // showPdfModal = false; // ELIMINAR si no se usa
  selectedPedido: Boleta | null = null;

  constructor(private pedidoService: PedidoService /*, private boletaService: BoletaService*/) {} // ELIMINAR BoletaService si ya no lo usas aquí

  ngOnInit(): void {
    this.pedidoService.obtenerHistorial().subscribe({
      next: (data: any[]) => this.pedidos = data,
      error: () => this.mensaje = 'No se pudo cargar el historial de pedidos'
    });
  }

  // Si 'cerrarModal()' y 'descargarBoletaPdf()' no se usan en PedidosComponent directamente, eliminarlos
  // cerrarModal(): void { /* ... */ }
  // descargarBoletaPdf(pedido: Boleta): void { /* ... */ }
  // generarBoleta(pedido: any): void { /* ... */ }


  abrirModalDetallePedido(pedido: Boleta): void {
    this.selectedPedido = pedido;
    this.showDetailModal = true;
    console.log('Estructura de selectedPedido:', JSON.stringify(this.selectedPedido, null, 2));
    console.log('PEDIDOS COMPONENT: Abrir modal. showDetailModal:', this.showDetailModal, 'selectedPedido:', this.selectedPedido);
  }

  cerrarModalDetalle = () => {
    this.showDetailModal = false;
    this.selectedPedido = null;
    console.log('PedidosComponent: Cerrando modal de detalle desde el padre. showDetailModal:', this.showDetailModal);
  };

  // ELIMINAR estos métodos si ya no abres un modal de PDF separado
  // abrirModalPdfBoleta(pedido: Boleta): void { /* ... */ }
  // cerrarModalPdfBoleta(): void { /* ... */ }
}
