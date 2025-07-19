package com.example.VentasSql.Entidad;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleBoleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boleta_id")
    @JsonBackReference // Evita recursión infinita en JSON
    private Boleta boleta;

    @ManyToOne(fetch = FetchType.EAGER) // Producto podría ser EAGER si siempre lo necesitas cargado
    @JoinColumn(name = "producto_id")
    private Producto producto; // Asegúrate de que este tenga un getter para `nombre`

    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotalDetalle;

    // Getters y Setters (si no usas Lombok @Data)
}