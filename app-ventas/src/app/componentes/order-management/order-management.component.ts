import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/model/pedido/pedido.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { OrderDetailModalAdminComponent } from './order-detail-modal-admin.component';
import { Boleta } from 'src/app/model/boleta/boleta';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { AuthService } from 'src/app/auth/AuthService';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { OrderDetailModalComponent } from "../pedidos/order-detail-modal.component";
import { Router } from '@angular/router';

// import { BoletaPdfModalComponent } from './boleta-pdf-modal.component'; // ¡ELIMINAR esta importación!



@Component({
  selector: 'app-admin-pedidos', // Usando el selector que proporcionaste
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, OrderDetailModalAdminComponent, OrderDetailModalComponent] // Usa el nombre de tu modal real
 // Usa el nombre de tu modal real
 // Usa el nombre de tu modal real
})
export class OrderManagementComponent implements OnInit {
  pedidos: Boleta[] = [];
  mensaje: string = '';
  mensajeTipo: 'exito' | 'error' = 'exito';
  showDetailModal: boolean = false;
  selectedPedido: Boleta | null = null;

  constructor(private boletaService: BoletaService, private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.loadAllPedidos();
  }

  loadAllPedidos(): void {
    if (this.authService.isAdmin() || this.authService.isUser()) {
      this.boletaService.getAllBoletasForAdmin().subscribe({
        next: (data: Boleta[]) => {
          this.pedidos = data;
          this.mensaje = '';
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeTipo = 'error';
          if (err.status === 403) {
            this.mensaje = 'No tienes permiso para ver todos los pedidos.';
          } else {
            this.mensaje = `Error al cargar todos los pedidos: ${err.message || err.statusText}`;
          }
          console.error('Error al cargar todos los pedidos:', err);
        }
      });
    } else {
      this.mensajeTipo = 'error';
      this.mensaje = 'Acceso denegado. Debes iniciar sesión para ver tus pedidos.';
    }
  }

  openDetailModal(pedido: Boleta): void {
    this.selectedPedido = pedido;
    this.showDetailModal = true;
  }
  cerrarModalDetalle = () => {
    this.showDetailModal = false;
    this.selectedPedido = null;
    console.log('PedidosComponent: Cerrando modal de detalle desde el padre. showDetailModal:', this.showDetailModal);
  };


  descargarPdf(boletaId: number | undefined): void {
    if (boletaId) {
      this.boletaService.descargarBoletaPdf(boletaId).subscribe({
        next: (data: Blob) => {
          const fileURL = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = `boleta-${boletaId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(fileURL);
          this.mensajeTipo = 'exito';
          this.mensaje = 'Boleta descargada con éxito.';
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeTipo = 'error';
          this.mensaje = `Error al descargar la boleta: ${err.message || err.statusText}`;
          console.error('Error al descargar PDF:', err);
          setTimeout(() => this.mensaje = '', 5000);
        }
      });
    } else {
      this.mensajeTipo = 'error';
      this.mensaje = 'ID de boleta no disponible para descargar.';
      setTimeout(() => this.mensaje = '', 3000);
    }
  }

  eliminarBoleta(boletaId: number | undefined): void {
    if (!this.authService.isAdmin()) {
      alert('Debe autenticarse como administrador para eliminar pedidos.');
      this.router.navigate(['/login']);
      return;
    }
    if (boletaId && confirm('¿Estás seguro de que quieres eliminar esta boleta? Esta acción es irreversible.')) {
      this.boletaService.deleteBoletaConPedido(boletaId).subscribe({
        next: (response) => {
          this.mensajeTipo = 'exito';
          this.mensaje = response;
          this.loadAllPedidos();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeTipo = 'error';
          this.mensaje = `Error al eliminar la boleta: ${err.error?.message || err.message || err.statusText}`;
          console.error('Error al eliminar boleta:', err);
          setTimeout(() => this.mensaje = '', 5000);
        }
      });
    } else if (!boletaId) {
      this.mensajeTipo = 'error';
      this.mensaje = 'ID de boleta no disponible para eliminar.';
      setTimeout(() => this.mensaje = '', 3000);
    }
  }

}

