package com.example.VentasSql.Entidad;
import com.example.VentasSql.Entidad.Producto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class CarritoItem {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    private Uuser usuario;

    @ManyToOne
    private Producto producto;

    private Integer cantidad;
}