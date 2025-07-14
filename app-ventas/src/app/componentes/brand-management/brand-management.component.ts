import { MarcaService } from 'src/app/model/Marca/marca.service';
import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/model/Marca/marca';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.css'],
  standalone: true,
      imports: [
        CommonModule,
        FormsModule, // <-- ¡Añádelo al array imports!
        HttpClientModule
      ]
})
export class BrandManagementComponent implements OnInit {
  marcas: Marca[] = [];
  nuevaMarcaNombre: string = '';
  mensaje: string = '';
  editandoMarca: Marca | null = null;

  constructor(
    private marcaService: MarcaService // Inyectar MarcaService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasMarcas();
  }

  obtenerTodasLasMarcas(): void {
        this.marcaService.getMarcas().subscribe({ // <-- ¡Corrección aquí!
          next: (data) => {
            this.marcas = data;
            console.log('Marcas cargadas:', this.marcas);
          },
          error: (err) => {
            console.error('Error al cargar las marcas:', err);
            // Manejo de errores, ej. this.mensaje = 'Error al cargar marcas';
          }
        });

  }

  crearMarca(): void {
    if (!this.nuevaMarcaNombre) {
      this.mensaje = 'El nombre de la marca no puede estar vacío.';
      return;
    }
    const nueva: Marca = { nombre: this.nuevaMarcaNombre };
    this.marcaService.createMarca(nueva).subscribe({
      next: () => {
        this.mensaje = 'Marca creada con éxito.';
        this.nuevaMarcaNombre = '';
        this.obtenerTodasLasMarcas();
      },
      error: (err) => this.mensaje = 'Error al crear marca: ' + (err.error || err.message)
    });
  }

  editarMarca(marca: Marca): void {
    this.editandoMarca = { ...marca }; // Copia para no modificar el original directamente
  }

  guardarEdicion(): void {
    if (!this.editandoMarca || !this.editandoMarca.nombre) {
      this.mensaje = 'El nombre de la marca no puede estar vacío.';
      return;
    }
    this.marcaService.updateMarca(this.editandoMarca.id!, this.editandoMarca).subscribe({
      next: () => {
        this.mensaje = 'Marca actualizada con éxito.';
        this.editandoMarca = null;
        this.obtenerTodasLasMarcas();
      },
      error: (err) => this.mensaje = 'Error al actualizar marca: ' + (err.error || err.message)
    });
  }

  cancelarEdicion(): void {
    this.editandoMarca = null;
  }

  eliminarMarca(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      this.marcaService.deleteMarca(id).subscribe({
        next: () => {
          this.mensaje = 'Marca eliminada con éxito.';
          this.obtenerTodasLasMarcas();
        },
        error: (err) => this.mensaje = 'Error al eliminar marca: ' + (err.error || err.message)
      });
    }
  }
}
