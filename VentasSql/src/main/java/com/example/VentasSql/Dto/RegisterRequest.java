package com.example.VentasSql.Dto;

import lombok.Data;
import com.example.VentasSql.Entidad.Role; 

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private Role role; 
}
