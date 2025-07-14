package com.example.VentasSql.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {
    @GetMapping("/api/seguro")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") 
    public String contenidoProtegido(){
        return "Este es un contenido protegido con JWT. ¡Acceso autorizado!";
    }
}
