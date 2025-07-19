import { Component, Input, Output, EventEmitter } from '@angular/core'; // Añadido Output, EventEmitter
import { Boleta } from 'src/app/model/boleta/boleta';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail-modal',
  template: `
    <div class="modal-backdrop" (click)="close()"></div>
    <div class="modal-content">
      <h2>Detalle del Pedido - Boleta {{ pedido?.numeroBoleta }}</h2>
      <p>Fecha: {{ pedido?.fechaEmision | date:'short' }}</p>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let detalle of pedido?.detalles">
            <td>{{ detalle.producto! }}</td> <td>{{ detalle.cantidad }}</td>
            <td>S/ {{ detalle.precioUnitario }}</td>
            <td>S/ {{ detalle.subtotalDetalle }}</td>
          </tr>
        </tbody>
      </table>
      <p>Subtotal: S/ {{ pedido?.subtotal }}</p>
      <p>IGV (18%): S/ {{ pedido?.igv }}</p>
      <p>Total: S/ {{ pedido?.total }}</p>
      <button (click)="close()">Cerrar</button>
      </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .modal-content {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      z-index: 1001;
      max-width: 600px;
      width: 90%;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
  `],
  standalone: true,
  imports: [CommonModule, DatePipe]
})
export class OrderDetailModalComponent {
  @Input() pedido?: Boleta;
  @Input() onClose!: () => void;
  // Cambiado el nombre de la entrada y el tipo de EventEmitter
 // Emitirá el objeto Boleta

  close() {
    if (this.onClose) {
      this.onClose();
    }
  }
  cerrarModal(): void {
    if (this.onClose) {
      this.onClose();
    }
  }

  // Cambiado el nombre de la función para reflejar su propósito

}
