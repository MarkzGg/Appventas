import { Producto } from 'src/app/model/producto/producto'; // Importa la interfaz Producto

export interface DetalleBoleta {
  id?: number;
  // boleta?: Boleta; // Evitar referencia circular si no es estrictamente necesario en el frontend
  producto?: Producto; // Usamos '?' porque puede ser lazy-loaded o no siempre presente en todas las respuestas
  cantidad?: number;
  precioUnitario?: number; // BigDecimal en Java se mapea a number en TypeScript
  subtotal?: number; // BigDecimal en Java se mapea a number en TypeScript (cambiado de subtotalDetalle para consistencia con el uso en el frontend)
}
