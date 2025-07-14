package com.example.VentasSql.Entidad;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Marca {
    @Id @GeneratedValue
    private Long id;
    private String nombre;
}
