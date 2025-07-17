import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria/categoria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Necesitarías un CategoryService similar a ProductoService o MarcaService
// import { CategoryService } from 'src/app/model/category/category.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- Añadir aquí
    FormsModule   // <-- ¡Añadir aquí!
  ],
})
export class CategoryManagementComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevaCategoriaNombre: string = '';
  mensaje: string = '';
  editandoCategoria: Categoria | null = null;

  constructor(
    // private categoryService: CategoryService // Descomentar cuando tengas el servicio
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    // this.categoryService.getCategorias().subscribe({
    //   next: (data) => this.categorias = data,
    //   error: (err) => this.mensaje = 'Error al cargar categorías: ' + (err.error || err.message)
    // });
    this.categorias = [{ id: 1, nombre: 'Electrónica' }, { id: 2, nombre: 'Ropa' }]; // Datos de ejemplo
  }

  crearCategoria(): void {
    if (!this.nuevaCategoriaNombre) {
      this.mensaje = 'El nombre de la categoría no puede estar vacío.';
      return;
    }
    const nueva: Categoria = { nombre: this.nuevaCategoriaNombre };
    // this.categoryService.crearCategoria(nueva).subscribe({
    //   next: () => {
    //     this.mensaje = 'Categoría creada con éxito.';
    //     this.nuevaCategoriaNombre = '';
    //     this.loadCategorias();
    //   },
    //   error: (err) => this.mensaje = 'Error al crear categoría: ' + (err.error || err.message)
    // });
    this.mensaje = `Categoría '${this.nuevaCategoriaNombre}' creada (simulado).`;
    this.nuevaCategoriaNombre = '';
    this.loadCategorias();
  }

  editarCategoria(categoria: Categoria): void {
    this.editandoCategoria = { ...categoria }; // Copia para no modificar el original directamente
  }

  guardarEdicion(): void {
    if (!this.editandoCategoria || !this.editandoCategoria.nombre) {
      this.mensaje = 'El nombre de la categoría no puede estar vacío.';
      return;
    }
    // this.categoryService.actualizarCategoria(this.editandoCategoria).subscribe({
    //   next: () => {
    //     this.mensaje = 'Categoría actualizada con éxito.';
    //     this.editandoCategoria = null;
    //     this.loadCategorias();
    //   },
    //   error: (err) => this.mensaje = 'Error al actualizar categoría: ' + (err.error || err.message)
    // });
    this.mensaje = `Categoría '${this.editandoCategoria.nombre}' actualizada (simulado).`;
    this.editandoCategoria = null;
    this.loadCategorias();
  }

  cancelarEdicion(): void {
    this.editandoCategoria = null;
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      // this.categoryService.eliminarCategoria(id).subscribe({
      //   next: () => {
      //     this.mensaje = 'Categoría eliminada con éxito.';
      //     this.loadCategorias();
      //   },
      //   error: (err) => this.mensaje = 'Error al eliminar categoría: ' + (err.error || err.message)
      // });
      this.mensaje = `Categoría con ID ${id} eliminada (simulado).`;
      this.loadCategorias();
    }
  }
}
