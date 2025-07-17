    // app-ventas\src\app\model\boleta\boleta.ts
    import { Usuario } from "../usuario/usuario";
import { DetalleBoleta } from "./detalle-boleta";

    export interface Boleta {
      id?: number;
      usuario?: Usuario; // Si necesitas el usuario asociado a la boleta
      numeroBoleta?: string; // Añadido
      fechaEmision?: string; // Cambiado de 'fecha' a 'fechaEmision'
      subtotal?: number; // Añadido
      igv?: number; // Añadido
      total?: number;
      detalles: DetalleBoleta[];
      // usuario?: any; // Si necesitas el usuario asociado a la boleta
    }

