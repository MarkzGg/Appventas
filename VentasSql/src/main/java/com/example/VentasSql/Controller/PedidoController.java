
package com.example.VentasSql.Controller;

import com.example.VentasSql.Dto.PedidoDto;
import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Entidad.DetallePedido;
import com.example.VentasSql.Entidad.Pedido;
import com.example.VentasSql.Entidad.Producto;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Repository.PedidoRepository;
import com.example.VentasSql.Repository.ProductoRepository;
import com.example.VentasSql.Repository.UserRepository;
import com.example.VentasSql.Service.BoletaPdfService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UserRepository userRepository;
    private final BoletaPdfService boletaPdfService;

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    @PostMapping("/crear")
    @PreAuthorize("permitAll()")
    @Transactional
    public ResponseEntity<?> crearPedido(@Valid @RequestBody List<PedidoRequest> pedidos, Principal principal) {
        try {
            if (pedidos == null || pedidos.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La lista de pedidos no puede estar vacía."));
            }

            Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();

            Map<Long, Integer> productosEnPedido = new HashMap<>();
            for (PedidoRequest p : pedidos) {
                productosEnPedido.merge(p.getProductoId(), p.getCantidad(), Integer::sum);
            }

            List<DetallePedido> detallesPedido = new ArrayList<>();
            BigDecimal subtotalGeneral = BigDecimal.ZERO;
            StringBuilder mensajeStockInsuficiente = new StringBuilder();

            for (Map.Entry<Long, Integer> entry : productosEnPedido.entrySet()) {
                Long productoId = entry.getKey();
                Integer cantidadSolicitada = entry.getValue();

                Producto producto = productoRepository.findById(productoId).orElse(null);
                if (producto == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Producto con ID " + productoId + " no encontrado."));
                }

                if (producto.getStock() < cantidadSolicitada) {
                    mensajeStockInsuficiente.append("No hay stock suficiente para el producto '")
                            .append(producto.getNombre())
                            .append("'. Stock disponible: ")
                            .append(producto.getStock())
                            .append(". Cantidad solicitada: ")
                            .append(cantidadSolicitada)
                            .append(".\n");
                } else {
                    BigDecimal precioUnitario = producto.getPrecio();
                    BigDecimal subtotalDetalle = precioUnitario.multiply(BigDecimal.valueOf(cantidadSolicitada));
                    subtotalGeneral = subtotalGeneral.add(subtotalDetalle);

                    DetallePedido detalle = new DetallePedido();
                    detalle.setProducto(producto);
                    detalle.setCantidad(cantidadSolicitada);
                    detalle.setPrecioUnitario(precioUnitario.doubleValue());
                    detalle.setSubtotalDetalle(subtotalDetalle.doubleValue());
                    detallesPedido.add(detalle);
                }
            }

            if (mensajeStockInsuficiente.length() > 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", mensajeStockInsuficiente.toString()));
            }

            Pedido pedido = new Pedido();
            pedido.setFechaPedido(LocalDateTime.now());
            pedido.setUsuario(usuario);
            pedido.setDetalles(detallesPedido);
            pedido.setTotal(subtotalGeneral.setScale(2, RoundingMode.HALF_UP));
            detallesPedido.forEach(detalle -> detalle.setPedido(pedido));

            pedidoRepository.save(pedido);

            // Update stock
            for (DetallePedido detalle : detallesPedido) {
                Producto producto = detalle.getProducto();
                producto.setStock(producto.getStock() - detalle.getCantidad());
                productoRepository.save(producto);
            }

            return ResponseEntity.ok(Map.of("message", "Pedido creado con éxito", "pedidoId", pedido.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al crear el pedido: " + e.getMessage()));
        }
    }

    @GetMapping("/historial")
    @PreAuthorize("hasAnyRole('COMPRADOR','ADMIN', 'USER')")
    public ResponseEntity<List<PedidoDto>> obtenerHistorialPedidos(Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName())
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        List<Pedido> historialEntidades = pedidoRepository.findByUsuario(usuario);

        // Mapear entidades a DTOs
        List<PedidoDto> historialDto = historialEntidades.stream()
                                                          .map(PedidoDto::new)
                                                          .collect(Collectors.toList());

        return ResponseEntity.ok(historialDto);
    }
    // Ejemplo en PedidoController.java (o BoletaController)
// @GetMapping("/pdf/{pedidoId}")
// public ResponseEntity<byte[]> generarPdfBoleta(@PathVariable Long pedidoId) {
//     try {
//         // 1. Buscar el pedido por ID
//         Pedido pedido = pedidoRepository.findById(pedidoId)
//             .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));

//         // 2. Lógica para generar el PDF (esto es solo un placeholder)
//         byte[] pdfContents = boletaPdfService.generarPdfBoleta(pedido);
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_PDF);
//         String filename = "boleta_" + pedidoId + ".pdf";
//         headers.setContentDispositionFormData("attachment", filename); // Para que el navegador lo descargue

//         return new ResponseEntity<>(pdfContents, headers, HttpStatus.OK);

//     } catch (Exception e) {
//         // Manejo de errores
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                              .body(("Error al generar el PDF: " + e.getMessage()).getBytes());
//     }
// }
// Necesitarás implementar la función generarContenidoPdf(Pedido pedido)
// que use una librería de PDF para crear el archivo.
}
