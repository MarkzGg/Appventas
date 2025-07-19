package com.example.VentasSql.Controller;

import com.example.VentasSql.Dto.AuthRequest;
import com.example.VentasSql.Dto.AuthResponse;
import com.example.VentasSql.Dto.RegisterRequest; // Importamos el nuevo DTO
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.UserRepository;
import com.example.VentasSql.Seguridad.JwtUtil;
import com.example.VentasSql.Entidad.Role;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Importar
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/registro")
    public String registrar(@RequestBody AuthRequest auth){
        if (userRepository.findByUsername(auth.getUsername()).isPresent()) {
            return "El nombre de usuario ya existe.";
        }
        Uuser u = Uuser.builder()
                .username(auth.getUsername())
                .password(passwordEncoder.encode(auth.getPassword()))
                .role(Role.USER) // Asignamos el rol USER por defecto
                .build();
        userRepository.save(u);
        return "Usuario registrado correctamente con rol USER.";
    }

    
    @PostMapping("/admin/registro-usuario")
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<String> registrarUsuarioConRol(@RequestBody RegisterRequest request){
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya existe.");
        }
        Uuser u = Uuser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre()) // Asignamos el nombre
                .role(request.getRole()) 
                .build();
        userRepository.save(u);
        String token = jwtUtil.generateToken(u.getUsername(), u.getRole().name());
        return ResponseEntity.ok("Usuario registrado correctamente con rol " + request.getRole().name() + ".");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/asignar-rol")
    public ResponseEntity<String> asignarRol(@RequestParam String username, @RequestParam Role nuevoRol) {
        Uuser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setRole(nuevoRol);
        userRepository.save(user);
        return ResponseEntity.ok("Rol actualizado a " + nuevoRol.name());
    }

    @PostMapping("/registro-comprador")
    public ResponseEntity<String> registrarComprador(@RequestBody AuthRequest auth) {
        if (userRepository.findByUsername(auth.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya existe.");
        }

        Uuser comprador = Uuser.builder()
                .username(auth.getUsername())
                .password(passwordEncoder.encode(auth.getPassword()))
                .role(Role.COMPRADOR)
                .build();

        userRepository.save(comprador);
        return ResponseEntity.ok("Comprador registrado correctamente.");
    }


    @PostMapping("/auth/login")
    public AuthResponse login(@RequestBody AuthRequest request){
        try {
            System.out.println("Intentando autenticar: " + request.getUsername());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            System.out.println("Autenticación exitosa para: " + request.getUsername());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error de autenticación: " + e.getMessage());
        }

        Uuser user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticación."));

        String token = jwtUtil.generateToken(request.getUsername(), user.getRole().name());
        return new AuthResponse(token);
    }
    @PutMapping("/admin/editar-usuario/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<String> editarUsuario(@PathVariable Long id, @RequestBody RegisterRequest request) {
    Uuser usuario = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // Actualizar los campos del usuario
    usuario.setUsername(request.getUsername());
    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
        usuario.setPassword(passwordEncoder.encode(request.getPassword())); // Codificar la nueva contraseña
    }
    usuario.setNombre(request.getNombre());
    usuario.setRole(request.getRole());

    userRepository.save(usuario);
    return ResponseEntity.ok("Usuario actualizado correctamente.");
}


    @GetMapping("/token-visitante")
    public AuthResponse generarTokenVisitante() {
        String token = jwtUtil.generateToken("anonimo", Role.VISITANTE.name());
        return new AuthResponse(token);
    }



}
