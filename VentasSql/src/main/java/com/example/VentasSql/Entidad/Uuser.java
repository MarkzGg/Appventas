package com.example.VentasSql.Entidad;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.VentasSql.Entidad.Role; 

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Uuser {
    @Id @GeneratedValue
    private Long id;
    private String username;
    private String password;

    private String nombre;
    private String direccion;
    private String telefono;


    @Enumerated(EnumType.STRING) 
    private Role role; 
}
