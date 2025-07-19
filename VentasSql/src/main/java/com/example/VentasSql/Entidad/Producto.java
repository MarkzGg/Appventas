package com.example.VentasSql.Entidad;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

import com.example.VentasSql.Entidad.Categoria;
import com.example.VentasSql.Entidad.Marca;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Long id;

    private String nombre;
    private Integer stock;
    private String descripcion;
    private BigDecimal precio;

    @ManyToOne
    private Marca marca;

    @ManyToOne
    private Categoria categoria;

    
}
