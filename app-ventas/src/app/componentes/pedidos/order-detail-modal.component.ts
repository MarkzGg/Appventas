import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Boleta } from 'src/app/model/boleta/boleta';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { BoletaService } from 'src/app/model/boleta/boleta.service'; // Importa el servicio de boletas
import { DomSanitizer } from '@angular/platform-browser'; // Importa DomSanitizer

@Component({
  selector: 'app-order-detail-modal',
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
          <button (click)="cerrarModal()">Cerrar</button>
          <button (click)="descargarBoletaPdf()">Descargar Boleta PDF</button> </div>
      </div>
    </div>
  `,
  styles: [`
    /* Tus estilos CSS existentes para .modal-overlay y .modal-content */
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
      max-height: 90vh; /* Para que el contenido sea scrollable si es muy largo */
      overflow-y: auto; /* Para que el contenido sea scrollable si es muy largo */
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
    /* Estilo específico para el botón de descarga */
    .modal-actions button:nth-child(2) { /* Selecciona el segundo botón (Descargar) */
        background-color: #007bff; /* Azul */
        margin-left: 10px;
    }
    .modal-actions button:nth-child(2):hover {
        background-color: #0056b3;
    }
  `],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe]
})
export class OrderDetailModalComponent {
  @Input() pedido?: Boleta;
  @Input() onClose!: () => void;

  constructor(
    private boletaService: BoletaService, // Inyecta el servicio
    private sanitizer: DomSanitizer // Inyecta DomSanitizer
  ) { }

  cerrarModal(): void {
    console.log('OrderDetailModalComponent: Se hizo clic en Cerrar.');
    if (this.onClose) {
      this.onClose();
      console.log('OrderDetailModalComponent: Ejecutando onClose del padre.');
    } else {
      console.warn('OrderDetailModalComponent: onClose no está definido.');
    }
  }

  descargarBoletaPdf(): void {
    if (this.pedido && this.pedido.id) { // Asegúrate de que 'pedido' y 'pedido.id' existan
      console.log(`Solicitando descarga de PDF para la boleta con ID: ${this.pedido.id}`);
      this.boletaService.descargarBoletaPdf(this.pedido.id).subscribe({
        next: (response: Blob) => {
          // Crea una URL de objeto temporal para el Blob
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a'); // Crea un elemento 'a' para la descarga
          a.href = url; // Establece el href a la URL del Blob
          a.download = `boleta_pedido_${this.pedido!.numeroBoleta || this.pedido!.id}.pdf`; // Nombre del archivo, usa numeroBoleta si está disponible
          document.body.appendChild(a); // Añade el 'a' al cuerpo del documento (invisible)
          a.click(); // Simula un clic para iniciar la descarga
          document.body.removeChild(a); // Elimina el elemento 'a'
          window.URL.revokeObjectURL(url); // Libera la URL del objeto para liberar memoria
          console.log('PDF de boleta descargado con éxito.');
        },
        error: (err) => {
          console.error('Error al descargar PDF:', err);
          // Muestra un mensaje al usuario
          alert('Error al descargar el PDF de la boleta: ' + (err.error?.message || 'Intente nuevamente.'));
        }
      });
    } else {
      alert('No se puede descargar la boleta: ID del pedido no disponible.');
    }
  }
}
