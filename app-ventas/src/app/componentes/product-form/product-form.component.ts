// product-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/AuthService';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- Añadir aquí
    FormsModule   // <-- ¡Añadir aquí!
  ],
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
    private router: Router,
    private authService: AuthService
  ) {}

ngOnInit(): void {
      // Obtener el ID de la URL (para edición)
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.editando = true;
          this.productoService.getProducto(Number(id)).subscribe({
            next: (data) => this.producto = data,
            error: () => this.mensaje = 'No se pudo cargar el producto'
          });
        }
      });
}

guardar(): void {
    // Validar permisos antes de guardar
    if (this.editando && !(this.authService.isUser() || this.authService.isAdmin())) {
      this.mensaje = 'No tienes permiso para editar productos.';
      return;
    }
    if (!this.editando && !this.authService.isAdmin()) {
      this.mensaje = 'No tienes permiso para crear productos.';
      return;
    }
    if (this.editando) {
      this.productoService.actualizarProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/admin/productos']),
        error: () => this.mensaje = 'Error al actualizar producto'
      });
    } else {
      this.productoService.crearProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/admin/productos']),
        error: () => this.mensaje = 'Error al crear producto'
      });
    }
  }
}
