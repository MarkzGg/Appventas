package com.example.VentasSql.Entidad;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Boleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroBoleta;
    private LocalDateTime fechaEmision;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;

    @ManyToOne(fetch = FetchType.LAZY) // Relación con el usuario (comprador)
    @JoinColumn(name = "user_id") // Columna en la tabla boleta que referencia al usuario
    private Uuser usuario; // Asegúrate de tener este campo

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // Evita recursión infinita en JSON
    private List<DetalleBoleta> detalles;

    // Getters y Setters (si no usas Lombok @Data)
}