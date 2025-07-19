import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { Boleta } from 'src/app/model/boleta/boleta';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-boleta-pdf-modal',
  templateUrl: './boleta-pdf-modal.component.html',
  styleUrls: ['./boleta-pdf-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BoletaPdfModalComponent implements OnChanges {
  @Input() pedido: Boleta | null = null;
  @Output() onClose = new EventEmitter<void>(); // Evento para cerrar este modal

  pdfUrl: SafeResourceUrl | null = null;
  loadingPdf: boolean = false;
  errorMessage: string = '';


  constructor(
    private boletaService: BoletaService,
    private sanitizer: DomSanitizer // Para sanitizar la URL del PDF
  ) {}

  // Este método se ejecuta cuando las propiedades de entrada cambian
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pedido'] && this.pedido && this.pedido.id) {
      this.cargarYMostrarPdf(this.pedido.id);
    } else if (changes['pedido'] && !this.pedido) {
      this.pdfUrl = null; // Limpiar si el pedido es nulo
      this.errorMessage = '';
    }
  }

  cargarYMostrarPdf(pedidoId: number): void {
    this.loadingPdf = true;
    this.errorMessage = '';
    this.pdfUrl = null;

    this.boletaService.descargarBoletaPdf(pedidoId).subscribe({
      next: (response: Blob) => {
        const url = URL.createObjectURL(response);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loadingPdf = false;
        // No revocar aquí, el iframe lo necesita. Se revoca al cerrar el modal padre o destruir el componente si es necesario.
      },
      error: (err) => {
        console.error('Error al cargar PDF para visualización:', err);
        this.errorMessage = 'No se pudo cargar la vista previa del PDF: ' + (err.error?.message || err.message || 'Error desconocido');
        this.loadingPdf = false;
        this.pdfUrl = null;
      }
    });
  }

  descargarBoletaPdf(): void {
    if (this.pedido && this.pedido.id) {
      console.log(`Descargando PDF para la boleta con ID: ${this.pedido.id}`);
      this.boletaService.descargarBoletaPdf(this.pedido.id).subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = `boleta_pedido_${this.pedido!.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar PDF:', err);
          this.errorMessage = 'Error al descargar el PDF de la boleta: ' + (err.error?.error || 'Intente nuevamente.');
        }
      });
    } else {
      this.errorMessage = 'No se encontró ID para descargar la boleta.';
    }
  }

  cerrarModal(): void {
    if (this.pdfUrl) {
      // Es importante revocar el Object URL cuando ya no se necesita
      // para liberar memoria.
      URL.revokeObjectURL(this.pdfUrl.toString().split(' ').pop() || ''); // Extrae la URL real
    }
    this.onClose.emit(); // Emite el evento para que el padre cierre el modal
  }
}
