import { Component, OnInit } from '@angular/core';
import { Boleta } from 'src/app/model/boleta/boleta';
import { BoletaService } from 'src/app/model/boleta/boleta.service';
import { AuthService } from 'src/app/auth/AuthService';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  pedidos: Boleta[] = [];
  mensaje: string = '';

  constructor(
    private boletaService: BoletaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    // Asumiendo que hay un endpoint en BoletaService para obtener todas las boletas (solo para ADMIN/USER)
    // Si no existe, necesitarías añadirlo en el backend.
    // Por ahora, usaremos obtenerHistorial() que es para el usuario logueado, lo cual no es correcto para gestión.
    // Necesitarías un boletaService.getAllBoletas() en el backend.
    this.boletaService.obtenerHistorial().subscribe({ // Esto debe ser reemplazado por getAllBoletas()
      next: (data) => this.pedidos = data,
      error: (err) => this.mensaje = 'Error al cargar pedidos: ' + (err.error || err.message)
    });
  }

  verDetalle(pedido: Boleta): void {
    alert('Funcionalidad de ver detalle de pedido no implementada aún.');
    // Podrías abrir un modal o navegar a una ruta de detalle de pedido.
  }

  actualizarEstado(pedidoId: number, nuevoEstado: string): void {
    alert(`Funcionalidad de actualizar estado del pedido ${pedidoId} a ${nuevoEstado} no implementada aún.`);
    // Aquí llamarías a un servicio que interactúe con el backend para actualizar el estado del pedido.
  }

  calcularSubtotal(pedido: Boleta): number {
    return pedido.detalles.reduce((suma, d) => suma + (d.subtotal || 0), 0);
  }
}
