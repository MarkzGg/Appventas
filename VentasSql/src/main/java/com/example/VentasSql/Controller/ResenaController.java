package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.Resena;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.ResenaRepository;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/reseñas")
@RequiredArgsConstructor
public class ResenaController {
    private final ResenaRepository resenaRepository;
    private final UserRepository userRepository;

    @PostMapping("/crear")
    @PreAuthorize("hasRole('COMPRADOR')")
    public ResponseEntity<String> crear(@RequestBody Resena resena, Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();
        resena.setUsuario(usuario);
        resena.setAprobado(false);
        resenaRepository.save(resena);
        return ResponseEntity.ok("Reseña enviada para aprobación");
    }

    @GetMapping("/producto/{id}")
    @PreAuthorize("permitAll()") // Accesible por todos
    public List<Resena> verReseñas(@PathVariable Long id) {
        return resenaRepository.findByProductoIdAndAprobadoTrue(id);
    }

    @PutMapping("/moderar/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> aprobar(@PathVariable Long id) {
        Resena resena = resenaRepository.findById(id).orElseThrow();
        resena.setAprobado(true);
        resenaRepository.save(resena);
        return ResponseEntity.ok("Reseña aprobada");
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarResena(@PathVariable Long id) {
        try {
            if (!resenaRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reseña con ID " + id + " no encontrada.");
            }
            resenaRepository.deleteById(id);
            return ResponseEntity.ok("Reseña eliminada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la reseña: " + e.getMessage());
        }
    }
}