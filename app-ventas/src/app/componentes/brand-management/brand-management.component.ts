import { MarcaService } from 'src/app/model/Marca/marca.service';
import { Component, OnInit } from '@angular/core';
import { Marca } from 'src/app/model/Marca/marca';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// Importar el servicio de modales y el componente del modal de edición
// import { ModalService } from 'src/app/services/modal.service';
// import { MarcaEditModalComponent } from './marca-edit-modal/marca-edit-modal.component'; // Necesitarías crear este

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class BrandManagementComponent implements OnInit {
  marcas: Marca[] = [];
  nuevaMarcaNombre: string = '';
  mensaje: string = '';
  // editandoMarca: Marca | null = null; // Ya no se necesita para edición inline

  constructor(
    private marcaService: MarcaService,
    // private modalService: ModalService // Inyectar ModalService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasMarcas();
  }

  obtenerTodasLasMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
      },
      error: (err) => {
        console.error('Error al cargar las marcas:', err);
        this.mensaje = 'Error al cargar marcas';
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

  abrirModalEditarMarca(marca: Marca): void {
    // Aquí se usaría el ModalService para abrir el modal de edición
    // this.modalService.open(MarcaEditModalComponent, { marca: marca }).then(result => {
    //   if (result) { // Si el modal devuelve true (guardado)
    //     this.obtenerTodasLasMarcas();
    //   }
    // });
    // Por ahora, para simular, puedes usar un prompt o alert
    const nuevoNombre = prompt(`Editar nombre para ${marca.nombre}:`, marca.nombre);
    if (nuevoNombre !== null && nuevoNombre !== marca.nombre) {
      const marcaActualizada: Marca = { id: marca.id, nombre: nuevoNombre };
      this.marcaService.updateMarca(marca.id!, marcaActualizada).subscribe({
        next: () => {
          this.mensaje = 'Marca actualizada con éxito.';
          this.obtenerTodasLasMarcas();
        },
        error: (err) => this.mensaje = 'Error al actualizar marca: ' + (err.error || err.message)
      });
    }
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
