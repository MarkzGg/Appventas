package com.example.VentasSql.Dto;

import com.example.VentasSql.Entidad.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class PedidoDto {
    private Long id;
    private LocalDateTime fechaEmision;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String numeroBoleta;
    private String nombreUsuario;
    private List<DetallePedidoDto> detalles; // <-- Esto es una lista de DTOs de detalles, NO entidades

    public PedidoDto(Pedido pedido) {
        this.id = pedido.getId();
        this.fechaEmision = pedido.getFechaPedido();
        this.total = pedido.getTotal();

        BigDecimal igvRate = new BigDecimal("0.18");
        this.igv = pedido.getTotal().multiply(igvRate).divide(BigDecimal.ONE.add(igvRate), 2, java.math.RoundingMode.HALF_UP);
        this.subtotal = pedido.getTotal().subtract(this.igv);

        this.numeroBoleta = String.format("BOLETA-%06d", pedido.getId());

        this.nombreUsuario = pedido.getUsuario() != null ? pedido.getUsuario().getUsername() : "N/A";

        // Aquí es crucial: mapeamos las entidades DetallePedido a DetallePedidoDto
        // NO intentamos serializar la entidad Pedido dentro de DetallePedidoDto
        this.detalles = pedido.getDetalles() != null ?
                        pedido.getDetalles().stream()
                              .map(DetallePedidoDto::new) // <-- Llama al constructor del DTO de detalle
                              .collect(Collectors.toList()) :
                        List.of();
    }
}