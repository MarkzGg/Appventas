package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.example.VentasSql.Repository.UserRepository;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Uuser> crearUsuario(@RequestBody Uuser usuario) {
        Uuser nuevoUsuario = userRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario con ID " + id + " no encontrado.");
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok("Usuario eliminado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el usuario: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Uuser> listarUsuarios() {
        return userRepository.findAll();
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Uuser> actualizarUsuario(@PathVariable Long id, @RequestBody Uuser usuario) {
        // Verificar si el usuario existe
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 Not Found
        }
        // Actualizar el usuario
        usuario.setId(id); // Asegúrate de que el ID se establezca
        Uuser usuarioActualizado = userRepository.save(usuario);
        return ResponseEntity.ok(usuarioActualizado);
    }

}


