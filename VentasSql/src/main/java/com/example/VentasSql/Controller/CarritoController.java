package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.CarritoItem;
import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.CarritoRepository;
import com.example.VentasSql.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @DeleteMapping("/limpiar")
    @PreAuthorize("hasAnyRole('COMPRADOR')")
    public ResponseEntity<String> limpiarCarrito(Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();
        carritoRepository.deleteByUsuario(usuario);
        return ResponseEntity.ok("Carrito eliminado");
    }
}