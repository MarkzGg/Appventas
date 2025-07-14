package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
public class UsuarioController {

    private final UserRepository userRepository;

    @GetMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Uuser> getPerfil(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updatePerfil(@RequestBody Uuser datos, Principal principal) {
        Uuser user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setNombre(datos.getNombre());
        user.setDireccion(datos.getDireccion());
        user.setTelefono(datos.getTelefono());
        userRepository.save(user);

        return ResponseEntity.ok("Perfil actualizado correctamente");
    }

    @GetMapping("/listar")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Uuser> listarUsuarios() {
        return userRepository.findAll();
    }

}


