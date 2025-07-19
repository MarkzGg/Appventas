package com.example.VentasSql.Dto;

import com.example.VentasSql.Entidad.DetallePedido;
import lombok.Data;

@Data
public class DetallePedidoDto {
    private Long id;
    private String producto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotalDetalle;

    // Aquí está la clave: este DTO de detalle NO tiene una referencia al Pedido padre.
    // Si la tuviera, tendríamos otro bucle.
    // private PedidoDto pedido; // ¡NO INCLUIR ESTO AQUÍ!

    public DetallePedidoDto(DetallePedido detalle) {
        this.id = detalle.getId();
        this.producto = detalle.getProducto() != null ? detalle.getProducto().getNombre() : "Producto Desconocido";
        this.cantidad = detalle.getCantidad();
        this.precioUnitario = detalle.getPrecioUnitario();
        this.subtotalDetalle = detalle.getSubtotalDetalle();
    }
}