import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../auth/AuthService';
import {Router, RouterModule} from '@angular/router';
import {ProductoService} from '../../model/producto/producto.service';
import {Producto} from '../../model/producto/producto';
import { CarritoService } from 'src/app/model/carrito-item/carrito.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
      standalone: true, // Asegúrate de que esto esté aquí
      imports: [
        CommonModule, // <-- ¡Añadir CommonModule aquí!
        RouterModule
      ]
})
export class ProductsComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  agregarAlCarrito(producto: Producto) {
            if (!producto || !producto.id || (producto.stock || 0) <= 0) {
              alert('No se puede añadir este producto al carrito.');
              return;
            }
            const cantidad = 1; // O permitir al usuario elegir la cantidad
            this.carritoService.agregarProducto({ productoId: producto.id, cantidad: cantidad }).subscribe({
              next: () => {
                alert('Producto añadido al carrito!');
                // Opcional: Redirigir al carrito o actualizar el contador del carrito
              },
              error: (err) => {
                console.error('Error al añadir al carrito:', err);
                alert('Error al añadir el producto al carrito. Por favor, intente de nuevo.');
              }
            });
  }

   ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productoService.getProductos().subscribe(data => { // Usar el servicio ProductoService
          this.productos = data;
        });
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.http.delete(`${environment.apiUrl}/api/products/${id}`).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  editProduct(product: any) {
    this.router.navigate(['/admin/create'], { state: { product } });
  }

  buscar(keyword: string) {
    this.productoService.searchProductos(keyword).subscribe(productos => {
      this.productos = productos;
    });
  }

  seleccionarProducto(product: any = null) {
    this.productoSeleccionado = product;
  } // asegúrate que esté importado o usa 'any'





}
