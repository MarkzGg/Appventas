import { DetalleBoleta } from './detalle-boleta';

export interface Boleta {
  id?: number;
  fecha: string;
  total: number;
  detalles: DetalleBoleta[];
}
