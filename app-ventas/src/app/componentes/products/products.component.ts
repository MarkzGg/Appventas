import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado?: Producto;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
  }
}
