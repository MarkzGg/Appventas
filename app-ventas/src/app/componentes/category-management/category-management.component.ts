import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria/categoria'; // Importar la interfaz Categoria
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from 'src/app/model/categoria/categoria.service'; // Importar CategoriaService
import { HttpClientModule } from '@angular/common/http'; // Necesario si es standalone y el servicio no lo provee globalmente
@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- Añadir aquí
    FormsModule,   // <-- ¡Añadir aquí!
    HttpClientModule // Añadir si el componente es standalone y necesita HttpClient (aunque el servicio lo inyecta)
  ],
})
export class CategoryManagementComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevaCategoriaNombre: string = '';
  mensaje: string = '';
  editandoCategoria: Categoria | null = null;
  constructor(
    private categoriaService: CategoriaService // Inyectar CategoriaService
  ) {}
ngOnInit(): void {
    this.loadCategorias();
  }
  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log('Categorías cargadas:', this.categorias);
      },
      error: (err) => {
        console.error('Error al cargar las categorías:', err);
        this.mensaje = 'Error al cargar categorías: ' + (err.error?.message || err.message);
      }
    });
  }
  crearCategoria(): void {
    if (!this.nuevaCategoriaNombre) {
      this.mensaje = 'El nombre de la categoría no puede estar vacío.';
      return;
    }
const nueva: Categoria = { nombre: this.nuevaCategoriaNombre };
    this.categoriaService.createCategoria(nueva).subscribe({
      next: () => {
        this.mensaje = 'Categoría creada con éxito.';
        this.nuevaCategoriaNombre = '';
        this.loadCategorias();
      },
      error: (err) => this.mensaje = 'Error al crear categoría: ' + (err.error?.message || err.message)
    });
  }
  editarCategoria(categoria: Categoria): void {
    this.editandoCategoria = { ...categoria }; // Copia para no modificar el original directamente
  }
  guardarEdicion(): void {
    if (!this.editandoCategoria || !this.editandoCategoria.nombre) {
      this.mensaje = 'El nombre de la categoría no puede estar vacío.';
      return;
    }
    this.categoriaService.updateCategoria(this.editandoCategoria.id!, this.editandoCategoria).subscribe({
      next: () => {
        this.mensaje = 'Categoría actualizada con éxito.';
        this.editandoCategoria = null;
        this.loadCategorias();
      },
      error: (err) => this.mensaje = 'Error al actualizar categoría: ' + (err.error?.message || err.message)
    });
  }
cancelarEdicion(): void {
    this.editandoCategoria = null;
  }
  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.mensaje = 'Categoría eliminada con éxito.';
          this.loadCategorias();
        },
        error: (err) => this.mensaje = 'Error al eliminar categoría: ' + (err.error?.message || err.message)
      });
    }
  }
}
