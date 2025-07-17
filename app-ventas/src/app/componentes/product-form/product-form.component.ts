import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; // Importar Input, Output, EventEmitter
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/model/producto/producto';
import { ProductoService } from 'src/app/model/producto/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/AuthService';
import { MarcaService } from 'src/app/model/Marca/marca.service'; // Importar MarcaService
import { CategoriaService } from 'src/app/model/categoria/categoria.service';// Importar CategoriaService
import { Marca } from 'src/app/model/Marca/marca';
import { Categoria } from 'src/app/model/categoria/categoria';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class ProductFormComponent implements OnInit {
  @Input() productId: number | null = null; // Para recibir el ID si es edición (cuando se usa como modal)
  @Output() productSaved = new EventEmitter<boolean>(); // Para notificar al padre que se guardó
  @Output() cancelEdit = new EventEmitter<void>(); // Para notificar al padre que se canceló

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    marca: { nombre: '' }, // Inicializar para evitar errores de acceso
    categoria: { nombre: '' } // Inicializar
  };
  mensaje = '';
  editando = false;
  marcas: Marca[] = [];
  categorias: Categoria[] = [];

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private marcaService: MarcaService, // Inyectar
    private categoriaService: CategoriaService // Inyectar
  ) {}

  ngOnInit(): void {
    this.loadMarcas();
    this.loadCategorias();

    // Lógica para cargar producto si es edición (desde ruta o Input)
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const idToLoad = this.productId || (idFromRoute ? Number(idFromRoute) : null);

    if (idToLoad) {
      this.editando = true;
      this.productoService.getProducto(idToLoad).subscribe({
        next: (data) => {
          this.producto = data;
          // Asegurar que los IDs de marca/categoría estén en el modelo para el select
          if (this.producto.marca) {
            this.producto.marca.id = this.producto.marca.id;
          }
          if (this.producto.categoria) {
            this.producto.categoria.id = this.producto.categoria.id;
          }
        },
        error: () => this.mensaje = 'No se pudo cargar el producto'
      });
    }
  }

  loadMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next: (data) => this.marcas = data,
      error: (err) => console.error('Error al cargar marcas:', err)
    });
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  guardar(): void {
    // Validar permisos (aunque los guards de ruta ya lo hacen, es una capa extra)
    if (this.editando && !(this.authService.isUser() || this.authService.isAdmin())) {
      this.mensaje = 'No tienes permiso para editar productos.';
      return;
    }
    if (!this.editando && !this.authService.isAdmin()) {
      this.mensaje = 'No tienes permiso para crear productos.';
      return;
    }

    // Preparar el objeto producto para enviar al backend
    const productoToSend = { ...this.producto };
    if (productoToSend.marca && productoToSend.marca.id) {
      productoToSend.marca = { id: productoToSend.marca.id } as Marca; // Enviar solo el ID
    } else {
      productoToSend.marca = undefined; // Si no se seleccionó marca
    }
    if (productoToSend.categoria && productoToSend.categoria.id) {
      productoToSend.categoria = { id: productoToSend.categoria.id } as Categoria; // Enviar solo el ID
    } else {
      productoToSend.categoria = undefined; // Si no se seleccionó categoría
    }


    if (this.editando) {
      this.productoService.actualizarProducto(productoToSend).subscribe({
        next: () => {
          this.mensaje = 'Producto actualizado con éxito';
          this.productSaved.emit(true); // Emitir evento de guardado
          if (!this.productId) { // Si no se usa como modal, redirigir
            this.router.navigate(['/admin/productos']);
          }
        },
        error: (err) => this.mensaje = 'Error al actualizar producto: ' + (err.error || err.message)
      });
    } else {
      this.productoService.crearProducto(productoToSend).subscribe({
        next: () => {
          this.mensaje = 'Producto creado con éxito';
          this.productSaved.emit(true); // Emitir evento de guardado
          if (!this.productId) { // Si no se usa como modal, redirigir
            this.router.navigate(['/admin/productos']);
          }
        },
        error: (err) => this.mensaje = 'Error al crear producto: ' + (err.error || err.message)
      });
    }
  }

  cancelar(): void {
    this.cancelEdit.emit(); // Emitir evento de cancelación
    if (!this.productId) { // Si no se usa como modal, redirigir
      this.router.navigate(['/admin/productos']);
    }
  }
}
