import { Component, OnInit } from '@angular/core';
import { Boleta } from 'src/app/model/boleta/boleta';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Importar DatePipe, DecimalPipe
// import { ModalService } from 'src/app/services/modal.service';
// import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component'; // Necesitarías crear este

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe] // Añadir pipes
})
export class PedidosComponent implements OnInit {
  pedidos: Boleta[] = [];
  mensaje = '';

  constructor(
    private boletaService: BoletaService,
    // private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.boletaService.obtenerHistorial().subscribe({
      next: (data) => this.pedidos = data,
      error: () => this.mensaje = 'No se pudo cargar el historial de pedidos'
    });
  }

  abrirModalDetallePedido(pedido: Boleta): void {
    // Aquí se usaría el ModalService para abrir el modal de detalle de pedido
    // this.modalService.open(OrderDetailModalComponent, { pedido: pedido });
    alert('Funcionalidad de ver detalle de pedido no implementada aún. Detalles en consola.');
    console.log('Detalle del Pedido:', pedido);
  }
}
