    import { Component, OnInit } from '@angular/core';
    import { Boleta } from 'src/app/model/boleta/boleta';
    import { BoletaService } from 'src/app/model/boleta/boleta.service';
    import { AuthService } from 'src/app/auth/AuthService';
    import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    // import { ModalService } from 'src/app/services/modal.service';
    // import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';

    @Component({
      selector: 'app-order-management',
      templateUrl: './order-management.component.html',
      styleUrls: ['./order-management.component.css'],
      standalone: true,
      imports: [CommonModule, FormsModule, DatePipe, DecimalPipe]
    })
    export class OrderManagementComponent implements OnInit {
      pedidos: Boleta[] = [];
      mensaje: string = '';

      constructor(
        private boletaService: BoletaService,
        public authService: AuthService,
        // private modalService: ModalService
      ) {}

      ngOnInit(): void {
        this.loadAllOrders();
      }

      loadAllOrders(): void {
        // Necesitas un endpoint en el backend para que ADMIN vea todas las boletas
        // Tu BoletaRepository tiene findByUsuario, pero no un findAll para ADMIN
        // Si no tienes un endpoint getAllBoletas en el backend, este método no funcionará como se espera para ADMIN
        // Por ahora, usaremos obtenerHistorial() que es para el usuario logueado, lo cual no es correcto para gestión.
        // Asumiendo que el backend tiene un endpoint para ADMIN como /boletas/all
        // this.boletaService.getAllBoletasForAdmin().subscribe({
        this.boletaService.obtenerHistorial().subscribe({ // TEMPORAL: Esto solo carga las del usuario logueado
          next: (data) => this.pedidos = data,
          error: (err) => this.mensaje = 'Error al cargar pedidos: ' + (err.error || err.message)
        });
      }

      abrirModalDetallePedido(pedido: Boleta): void {
        // this.modalService.open(OrderDetailModalComponent, { pedido: pedido });
        alert('Funcionalidad de ver detalle de pedido no implementada aún. Detalles en consola.');
        console.log('Detalle del Pedido:', pedido);
      }

      actualizarEstado(pedidoId: number, event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;
        // Necesitas un endpoint en el backend para actualizar el estado de la boleta
        // this.boletaService.updateBoletaStatus(pedidoId, nuevoEstado).subscribe({
        //   next: () => {
        //     this.mensaje = 'Estado del pedido actualizado.';
        //     this.loadAllOrders();
        //   },
        //   error: (err) => this.mensaje = 'Error al actualizar estado: ' + (err.error || err.message)
        // });
        alert(`Funcionalidad de actualizar estado del pedido ${pedidoId} a ${nuevoEstado} no implementada aún.`);
      }
    }
