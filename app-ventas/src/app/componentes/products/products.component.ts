import { CategoriaService } from 'src/app/model/categoria/categoria.service';// Importar CategoriaService
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Considera si aún necesitas HttpClient directamente aquí
import { environment } from '../../../environments/environment'; // Considera si aún necesitas environment directamente aquí
import { AuthService } from '../../auth/AuthService';
import { Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../model/producto/producto.service';
import { Producto } from '../../model/producto/producto';
import { CarritoService } from 'src/app/model/carrito-item/carrito.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { MarcaService } from 'src/app/model/Marca/marca.service'; // Importar MarcaService
import { Marca } from 'src/app/model/Marca/marca'; // Importar Marca
import { Categoria } from 'src/app/model/categoria/categoria';// Importar Categoria

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // Añadir FormsModule
  ]
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  keyword: string = '';
  marcas: Marca[] = [];
  categorias: Categoria[] = [];
  selectedMarca: number | null = null;
  selectedCategory: number | null = null;
  constructor(
    private http: HttpClient, // Puedes eliminar si no lo usas directamente
    public auth: AuthService,
    private router: Router, // Puedes eliminar si no lo usas directamente
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private marcaService: MarcaService, // Inyectar MarcaService
    private categoriaService: CategoriaService // Inyectar CategoriaService
  ) {}
  ngOnInit() {
    this.loadProducts();
    this.loadMarcas();
    this.loadCategorias();
  }
  loadProducts() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }
  loadMarcas() {
    this.marcaService.getMarcas().subscribe(data => {
      this.marcas = data;
    });
  }
  loadCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }
  buscarProductos() {
    this.productoService.searchProductos(this.keyword).subscribe(productos => {
      this.productos = productos;
    });
  }
filtrarProductos() {
    // **IMPORTANTE:** Esta lógica filtra en el frontend. Para grandes datasets,
    // lo ideal es que el backend tenga un endpoint para filtrar por marca y/o categoría.
    // Si tu backend no tiene ese endpoint, esta función solo filtrará los productos
    // que ya se hayan cargado inicialmente.
    // Primero, recarga todos los productos para asegurar que el filtro se aplique sobre el conjunto completo
    // o ajusta para que la búsqueda y los filtros se combinen en una sola llamada al backend.
    this.productoService.getProductos().subscribe(allProducts => {
      let filtered = allProducts;
      if (this.selectedMarca) {
        filtered = filtered.filter(p => p.marca && p.marca.id === this.selectedMarca);
      }
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.categoria && p.categoria.id === this.selectedCategory);
      }
      // Si también hay una keyword, aplica la búsqueda sobre los resultados filtrados
      if (this.keyword) {
        filtered = filtered.filter(p => p.descripcion.toLowerCase().includes(this.keyword.toLowerCase()) || p.nombre.toLowerCase().includes(this.keyword.toLowerCase()));
      }
      this.productos = filtered;
    });
  }
  agregarAlCarrito(producto: Producto) {
    if (!producto || !producto.id || (producto.stock || 0) <= 0) {
      alert('No se puede añadir este producto al carrito.');
      return;
    }
    const cantidad = 1;
    this.carritoService.agregarProducto({ productoId: producto.id, cantidad: cantidad }).subscribe({
      next: () => {
        alert('Producto añadido al carrito!');
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
        alert('Error al añadir el producto al carrito. Por favor, intente de nuevo.');
      }
    });
  }
  seleccionarProducto(product: Producto) {
    this.productoSeleccionado = product;
  }
}
