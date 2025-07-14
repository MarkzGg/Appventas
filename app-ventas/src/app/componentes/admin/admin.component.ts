import { UsuarioService } from 'src/app/model/usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/AuthService';
// Asegúrate de que este modelo exista

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true, // Asumiendo que es standalone
  imports: [
    CommonModule, // Si es necesario
    FormsModule // Si estás usando formularios
  ]
})
export class AdminComponent implements OnInit {
  productos: Producto[] = [];

  mensaje = '';

  constructor(private productoService: ProductoService, private router: Router,public authService: AuthService) {}

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
        // Redirige a la ruta de creación/edición
        if (id === 0) { // Nuevo producto
          this.router.navigate(['/admin/productos/create']);
        } else { // Editar producto existente
          this.router.navigate(['/admin/productos/edit', id]);
        }
      }

  eliminarProducto(id: number): void {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => this.obtenerProductos(),
          error: () => this.mensaje = 'No se pudo eliminar el producto'
        });
      }


}
