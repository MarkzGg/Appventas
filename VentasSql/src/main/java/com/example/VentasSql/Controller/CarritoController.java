package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.CarritoItem;
import com.example.VentasSql.Entidad.Producto;
import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Repository.CarritoRepository;
import com.example.VentasSql.Repository.ProductoRepository;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/carrito")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final UserRepository userRepository;

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarProducto(@RequestBody PedidoRequest pedidoRequest, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Producto> productoOpt = productoRepository.findById(pedidoRequest.getProductoId());
        if (productoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Producto no encontrado");
        }
        var usuarioOpt = userRepository.findByUsername(userDetails.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        CarritoItem carritoItem = new CarritoItem();
        carritoItem.setProducto(productoOpt.get());
        carritoItem.setCantidad(pedidoRequest.getCantidad());
        carritoItem.setUsuario(usuarioOpt.get());
        carritoRepository.save(carritoItem);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> obtenerCarrito(@AuthenticationPrincipal UserDetails userDetails) {
        var usuarioOpt = userRepository.findByUsername(userDetails.getUsername());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }
        var carritoItems = carritoRepository.findByUsuario(usuarioOpt.get());
        return ResponseEntity.ok(carritoItems);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        if (!carritoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        carritoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/limpiar")
    public ResponseEntity<?> limpiarCarrito(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            var usuarioOpt = userRepository.findByUsername(userDetails.getUsername());
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            carritoRepository.deleteByUsuario(usuarioOpt.get());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al limpiar carrito: " + e.getMessage());
        }
    }
}
