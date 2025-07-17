import { Marca } from 'src/app/model/Marca/marca';
import { Categoria } from '../categoria/categoria';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  marca?: Marca;
  categoria?: Categoria;
}
