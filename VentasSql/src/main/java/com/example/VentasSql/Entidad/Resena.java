package com.example.VentasSql.Entidad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Entidad.Uuser; 
@Data

public class Resena {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    private Uuser usuario;

    @ManyToOne
    private Producto producto;

    private String comentario;
    private Integer puntuacion; // 1-5
    private boolean aprobado = false;
}
