import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/model/carrito-item/carrito.service';
import { CarritoItem } from 'src/app/model/carrito-item/carrito-item';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];
  mensaje = '';

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => this.carrito = data,
      error: () => this.mensaje = 'No se pudo cargar el carrito'
    });
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito().subscribe({
      next: () => {
        this.carrito = [];
        this.mensaje = 'Carrito vaciado';
      },
      error: () => this.mensaje = 'Error al limpiar carrito'
    });
  }

  getTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad * (item.producto?.precio || 0), 0);
  }
}
