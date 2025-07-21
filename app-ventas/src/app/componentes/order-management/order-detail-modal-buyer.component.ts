import { Component, Input } from '@angular/core';
import { Boleta } from 'src/app/model/boleta/boleta';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-order-detail-modal-buyer',
  template: `
    <div class="modal-overlay" (click)="cerrarModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
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
              <td>{{ detalle.producto }}</td>
              <td>{{ detalle.cantidad }}</td>
              <td>S/ {{ detalle.precioUnitario | number:'1.2-2' }}</td>
              <td>S/ {{ detalle.subtotalDetalle | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
        <p>Subtotal: S/ {{ pedido?.subtotal | number:'1.2-2' }}</p>
        <p>IGV (18%): S/ {{ pedido?.igv | number:'1.2-2' }}</p>
        <p>Total: S/ {{ pedido?.total | number:'1.2-2' }}</p>
        <div class="modal-actions">
          <button (click)="cerrarModalAlternativo()">Cerrar</button>
          <button (click)="descargarBoletaPdf()">Descargar Boleta PDF</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 20px;
      z-index: 1001;
      max-width: 600px;
      width: 90%;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      max-height: 90vh;
      overflow-y: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .modal-actions {
      margin-top: 20px;
      text-align: right;
    }
    .modal-actions button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #6c757d;
      color: white;
      transition: background-color 0.2s ease;
    }
    .modal-actions button:hover {
      background-color: #5a6268;
    }
    .modal-actions button:nth-child(2) {
      background-color: #007bff;
      margin-left: 10px;
    }
    .modal-actions button:nth-child(2):hover {
      background-color: #0056b3;
    }
  `],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe]
})
export class OrderDetailModalBuyerComponent {
  @Input() pedido: Boleta | null = null;
  @Input() onClose!: () => void;

  constructor(
    private boletaService: BoletaService,
    private sanitizer: DomSanitizer
  ) {}

  cerrarModal(): void {
    console.log('OrderDetailModalBuyerComponent: cerrarModal called');
    if (this.onClose) {
      this.onClose();
    }
  }

  cerrarModalAlternativo(): void {
    console.log('OrderDetailModalBuyerComponent: cerrarModalAlternativo called');
    if (this.onClose) {
      this.onClose();
    }
  }

  descargarBoletaPdf(): void {
    if (this.pedido && this.pedido.id) {
      this.boletaService.descargarBoletaPdf(this.pedido.id).subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = `boleta_pedido_${this.pedido!.numeroBoleta || this.pedido!.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          alert('Error al descargar el PDF de la boleta: ' + (err.error?.message || 'Intente nuevamente.'));
        }
      });
    } else {
      alert('No se puede descargar la boleta: ID del pedido no disponible.');
    }
  }
}
