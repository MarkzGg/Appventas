export interface Resena {
  id?: number;
  productoId: number;
  comentario: string;
  puntuacion: number;
  aprobado?: boolean;
}
