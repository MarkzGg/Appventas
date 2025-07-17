
import { Producto } from 'src/app/model/producto/producto';

export interface DetalleBoleta {
  id?: number;
  producto?: Producto;
  cantidad?: number;
  precioUnitario?: number;
  subtotalDetalle?: number; // Cambiado de 'subtotal' a 'subtotalDetalle'
}
