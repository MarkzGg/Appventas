// product-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };
  mensaje = '';
  editando = false;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id && id !== '0') {
      this.editando = true;
      this.productoService.getProducto(Number(id)).subscribe({
        next: (data) => this.producto = data,
        error: () => this.mensaje = 'No se pudo cargar el producto'
      });
    }
  }

  guardar(): void {
    if (this.editando) {
      this.productoService.actualizarProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: () => this.mensaje = 'Error al actualizar producto'
      });
    } else {
      this.productoService.crearProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: () => this.mensaje = 'Error al crear producto'
      });
    }
  }
}
