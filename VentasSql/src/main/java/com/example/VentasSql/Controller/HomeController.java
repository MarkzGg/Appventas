package com.example.VentasSql.Controller;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/home")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") 
    public String home(){
        return "¡Bienvenido! Acceso autorizado con token JWT";
    }
}

