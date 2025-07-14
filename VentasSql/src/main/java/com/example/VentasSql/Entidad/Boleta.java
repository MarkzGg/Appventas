package com.example.VentasSql.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(unique = true, nullable = false)
    private String numeroBoleta;

    private LocalDateTime fechaEmision;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoleta> detalles;

    private BigDecimal subtotal;
    private BigDecimal igv; 
    private BigDecimal total;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Uuser usuario;
    

}
