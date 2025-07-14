import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  productos: Producto[] = [];
  mensaje = '';

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => this.mensaje = 'Error al cargar productos'
    });
  }

  editarProducto(id: number): void {
    this.router.navigate(['/admin/create'], { queryParams: { id } });
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => this.obtenerProductos(),
      error: () => this.mensaje = 'No se pudo eliminar el producto'
    });
  }
}
