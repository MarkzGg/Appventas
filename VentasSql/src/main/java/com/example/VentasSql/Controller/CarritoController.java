package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.CarritoItem;
import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.CarritoRepository;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import com.example.VentasSql.Repository.ProductoRepository;


@RestController
@RequestMapping("/carrito")
@RequiredArgsConstructor
public class CarritoController {
    private final CarritoRepository carritoRepository;
    private final UserRepository userRepository;
    private final ProductoRepository productoRepository;

    @PostMapping("/agregar")
    @PreAuthorize("hasAnyRole('COMPRADOR')")
    public ResponseEntity<String> agregarProducto(@RequestBody PedidoRequest request, Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();
        Producto producto = productoRepository.findById(request.getProductoId())
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        CarritoItem item = new CarritoItem();
        item.setUsuario(usuario);
        item.setProducto(producto);
        item.setCantidad(request.getCantidad());
        carritoRepository.save(item);
        return ResponseEntity.ok("Producto añadido al carrito");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('COMPRADOR')")
    public List<CarritoItem> verCarrito(Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();
        return carritoRepository.findByUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPRADOR')")
    public ResponseEntity<String> eliminarItemCarrito(@PathVariable Long id, Principal principal) {
        try {
            Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            CarritoItem item = carritoRepository.findById(id).orElseThrow(() -> new RuntimeException("Item de carrito no encontrado"));
            // Verificar que el item pertenece al usuario autenticado
            if (!item.getUsuario().getId().equals(usuario.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para eliminar este item del carrito.");
            }
            carritoRepository.delete(item);
            return ResponseEntity.ok("Item del carrito eliminado correctamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el item del carrito: " + e.getMessage());
        }
    }
}