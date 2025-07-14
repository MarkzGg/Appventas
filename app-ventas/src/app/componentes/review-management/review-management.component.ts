import { Component, OnInit } from '@angular/core';
import { Resena } from 'src/app/model/reseña/reseña';
import { ResenaService } from 'src/app/model/reseña/reseña.service';
@Component({
  selector: 'app-review-management',
  templateUrl: './review-management.component.html',
  styleUrls: ['./review-management.component.css']
})
export class ReviewManagementComponent implements OnInit {
  resenasPendientes: Resena[] = [];
  mensaje: string = '';

  constructor(
    private resenaService: ResenaService // Inyectar ResenaService
  ) {}

  ngOnInit(): void {
    this.loadResenasPendientes();
  }

  loadResenasPendientes(): void {
    // Asumiendo que hay un endpoint en ResenaService para obtener reseñas pendientes de aprobación
    // Si no existe, necesitarías añadirlo en el backend (ej. GET /reseñas/pendientes)
    // Por ahora, simulamos datos.
    // this.resenaService.getResenasPendientes().subscribe({
    //   next: (data) => this.reseñasPendientes = data,
    //   error: (err) => this.mensaje = 'Error al cargar reseñas: ' + (err.error || err.message)
    // });
    this.resenasPendientes = [
      { id: 1, productoId: 101, comentario: 'Buen producto, pero llegó tarde.', puntuacion: 4, aprobado: false },
      { id: 2, productoId: 102, comentario: 'Excelente calidad, muy recomendado.', puntuacion: 5, aprobado: false }
    ];
  }

  aprobarResena(id: number): void {
    this.resenaService.aprobar(id).subscribe({
      next: () => {
        this.mensaje = 'Reseña aprobada con éxito.';
        this.loadResenasPendientes(); // Recargar la lista
      },
      error: (err) => this.mensaje = 'Error al aprobar reseña: ' + (err.error || err.message)
    });
  }

  rechazarResena(id: number): void {
    if (confirm('¿Estás seguro de que quieres rechazar esta reseña?')) {
      // Asumiendo que hay un endpoint en ResenaService para rechazar/eliminar reseñas
      // Si no existe, necesitarías añadirlo en el backend (ej. DELETE /reseñas/{id})
      // Por ahora, simulamos la eliminación.
      // this.resenaService.eliminarResena(id).subscribe({
      //   next: () => {
      //     this.mensaje = 'Reseña rechazada/eliminada con éxito.';
      //     this.loadResenasPendientes();
      //   },
      //   error: (err) => this.mensaje = 'Error al rechazar reseña: ' + (err.error || err.message)
      // });
      this.mensaje = `Reseña con ID ${id} rechazada (simulado).`;
      this.resenasPendientes = this.resenasPendientes.filter(r => r.id !== id);
    }
  }
}
