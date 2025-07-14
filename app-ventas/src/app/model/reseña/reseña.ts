export interface Reseña {
  id?: number;
  productoId: number;
  comentario: string;
  puntuacion: number;
  aprobado?: boolean;
}
