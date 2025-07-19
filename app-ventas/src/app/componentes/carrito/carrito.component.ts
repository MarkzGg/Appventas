import { BoletaService } from './../../model/boleta/boleta.service';
import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/model/carrito-item/carrito.service';
import { CarritoItem } from 'src/app/model/carrito-item/carrito-item';
import { PedidoRequest } from 'src/app/model/pedido-request/pedido-request';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
standalone: true,
      imports: [
        CommonModule,
        FormsModule // Necesario si usas [(ngModel)] en el input de cantidad
      ]
})
export class CarritoComponent implements OnInit {
  carrito: CarritoItem[] = [];
  mensaje = '';

  constructor(
    private carritoService: CarritoService,
    private boletaService: BoletaService, // Inyectar BoletaService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  realizarPedido(): void {
    if (this.carrito.length === 0) {
      this.mensaje = 'El carrito está vacío. No se puede realizar un pedido.';
      return;
    }
    const pedidos: PedidoRequest[] = this.carrito.map(item => ({
      productoId: item.producto?.id || 0,
      cantidad: item.cantidad
    }));
    this.carritoService.crearPedido(pedidos).subscribe({
      next: (res: any) => {
        this.mensaje = 'Pedido creado con éxito! ' + (res.message || '');
        this.boletaService.generarBoleta(pedidos).subscribe({
          next: (res2: any) => {
            this.mensaje += ' Boleta generada con éxito!';
            this.carrito = [];
            this.router.navigate(['/pedidos']);
          },
          error: (err2) => {
            console.error('Error al generar la boleta:', err2);
            this.mensaje = 'Error al generar la boleta: ' + (err2.error?.error || 'Verifique el stock o sus datos.');
          }
        });
      },
      error: (err: any) => {
        console.error('Error al crear el pedido:', err);
        this.mensaje = 'Error al crear el pedido: ' + (err.error?.error || 'Verifique el stock o sus datos.');
      }
    });
  }

  actualizarCantidad(item: CarritoItem): void {
        // Validar que la cantidad sea al menos 1
        if (item.cantidad <= 0) {
          item.cantidad = 1; // O eliminar el item si la cantidad es 0
        }
        // Como backend no soporta actualizar cantidad, solo actualizamos localmente y mostramos mensaje
        this.mensaje = `Cantidad de ${item.producto?.nombre} actualizada a ${item.cantidad} (no sincronizado con backend)`;
      }

  incrementarCantidad(item: CarritoItem): void {
        item.cantidad++;
        this.actualizarCantidad(item); // Llama al método principal de actualización
      }
      decrementarCantidad(item: CarritoItem): void {
        if (item.cantidad > 1) {
          item.cantidad--;
          this.actualizarCantidad(item); // Llama al método principal de actualización
        } else {
          // Opcional: Preguntar si desea eliminar el producto si la cantidad llega a 0
          // this.eliminarProductoDelCarrito(item);
        }
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
        // Redirigir a la página de productos tras vaciar carrito
        this.router.navigate(['/products']);
      },
      error: () => this.mensaje = 'Error al limpiar carrito'
    });
  }

  // realizarPedido(): void {
  //   if (this.carrito.length === 0) {
  //     this.mensaje = 'El carrito está vacío. No se puede realizar un pedido.';
  //     return;
  //   }
  //   const pedidos: PedidoRequest[] = this.carrito.map(item => ({
  //     productoId: item.producto?.id || 0,
  //     cantidad: item.cantidad
  //   }));
  //   this.boletaService.generarBoleta(pedidos).subscribe({
  //     next: (res: any) => {
  //       this.mensaje = 'Pedido realizado con éxito! ' + res;
  //       this.carrito = [];
  //       this.router.navigate(['/pedidos']);
  //     },
  //     error: (err) => {
  //       console.error('Error al realizar el pedido:', err);
  //       this.mensaje = 'Error al realizar el pedido: ' + (err.error || 'Verifique el stock o sus datos.');
  //     }
  //   });
  // }


  eliminarItem(itemId: number): void {
    // Cambiar a usar el método correcto del servicio
    this.carritoService.eliminarProducto(itemId).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado del carrito.';
        this.obtenerCarrito(); // Refrescar carrito para sincronizar
      },
      error: (err: any) => {
        console.error('Error al eliminar producto:', err);
        this.mensaje = 'Error al eliminar el producto. Intente nuevamente.';
      }
    });
  }

  getTotal(): number {
      return this.carrito.reduce((total, item) => {
        // Cambiado de item.producto?.precio a item.producto.precio
        const precio = item.producto.precio;
        // Cambiado de item.cantidad ?? 0 a item.cantidad
        const cantidad = item.cantidad;
        return total + (precio * cantidad);
      }, 0);
    }
}
