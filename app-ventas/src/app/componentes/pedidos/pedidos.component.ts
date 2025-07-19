import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/model/pedido/pedido.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderDetailModalComponent } from './order-detail-modal.component';
import { Boleta } from 'src/app/model/boleta/boleta';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { BoletaPdfModalComponent } from './boleta-pdf-modal.component'; // ¡Importa el nuevo modal!


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, OrderDetailModalComponent, BoletaPdfModalComponent]
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  mensaje = '';
  showModal = false;
  // selectedPedido: any | null = null;
  showDetailModal = false; // Renombramos para claridad
  showPdfModal = false;    // Nuevo estado para el modal de PDF
  selectedPedido: Boleta | null = null;

  constructor(private pedidoService: PedidoService, private boletaService: BoletaService) {}

  ngOnInit(): void {
    this.pedidoService.obtenerHistorial().subscribe({
      next: (data: any[]) => this.pedidos = data,
      error: () => this.mensaje = 'No se pudo cargar el historial de pedidos'
    });
  }



  cerrarModal(): void {
    this.showModal = false;
    this.selectedPedido = null;
  }
  descargarBoletaPdf(pedido: Boleta): void {
      if (pedido.id) { // Asumiendo que Boleta tiene un 'id' que corresponde al PedidoId
          console.log(`Solicitando PDF para la boleta con ID: ${pedido.id}`);
          this.boletaService.descargarBoletaPdf(pedido.id).subscribe({
            next: (response: Blob) => {
              const url = window.URL.createObjectURL(response);
              const a = document.createElement('a');
              a.href = url;
              a.download = `boleta_pedido_${pedido.id}.pdf`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              this.mensaje = 'PDF de boleta descargado con éxito.';
            },
            error: (err) => {
              console.error('Error al descargar PDF:', err);
              this.mensaje = 'Error al descargar el PDF de la boleta: ' + (err.error?.error || 'Intente nuevamente.');
            }
          });
      } else {
          this.mensaje = 'No se encontró ID para descargar la boleta.';
      }
      this.cerrarModal(); // Cierra el modal después de la acción
  }

  abrirModalDetallePedido(pedido: Boleta): void {
    this.selectedPedido = pedido;
    this.showDetailModal = true; // Abre el modal de detalle
  }

  cerrarModalDetalle(): void { // Renombramos para claridad
    this.showDetailModal = false;
    this.selectedPedido = null;
  }

  abrirModalPdfBoleta(pedido: Boleta): void { // Nuevo método para abrir el modal de PDF
    this.selectedPedido = pedido;
    this.showPdfModal = true;
  }

  cerrarModalPdfBoleta(): void { // Nuevo método para cerrar el modal de PDF
    this.showPdfModal = false;
    this.selectedPedido = null;
  }

  generarBoleta(pedido: any): void {
    // Aquí deberías implementar la llamada para generar la boleta desde un pedido
    // Por ejemplo, podrías llamar a un método en pedidoService o boletaService
    // Actualmente, solo cerramos el modal y mostramos mensaje
    this.mensaje = 'Funcionalidad de generar boleta no implementada para pedidos aún.';
    this.cerrarModal();
  }
}
