package com.example.VentasSql.Controller;

import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Entidad.Boleta;
import com.example.VentasSql.Entidad.DetalleBoleta;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Repository.BoletaRepository;
import com.example.VentasSql.Repository.DetalleBoletaRepository;
import com.example.VentasSql.Repository.ProductoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.VentasSql.Repository.UserRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/boletas")
@RequiredArgsConstructor
public class BoletaController {

    private final BoletaRepository boletaRepository;
    private final ProductoRepository productoRepository;
    private final DetalleBoletaRepository detalleBoletaRepository;
    private final UserRepository userRepository;

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18"); 

    @PostMapping("/generar")
    @PreAuthorize("hasAnyRole('COMPRADOR','USER', 'ADMIN')") 
    @Transactional 
    public ResponseEntity<?> generarBoleta(@Valid @RequestBody List<PedidoRequest> pedidos) {
        if (pedidos == null || pedidos.isEmpty()) {
            return ResponseEntity.badRequest().body("La lista de pedidos no puede estar vacía.");
        }

        Map<Long, Integer> productosEnPedido = new HashMap<>();
        for (PedidoRequest p : pedidos) {
            productosEnPedido.merge(p.getProductoId(), p.getCantidad(), Integer::sum);
        }

        List<DetalleBoleta> detallesBoleta = new ArrayList<>();
        BigDecimal subtotalGeneral = BigDecimal.ZERO;
        StringBuilder mensajeStockInsuficiente = new StringBuilder();

        // Primera pasada: Verificar stock y calcular subtotal por producto
        for (Map.Entry<Long, Integer> entry : productosEnPedido.entrySet()) {
            Long productoId = entry.getKey();
            Integer cantidadSolicitada = entry.getValue();

            Producto producto = productoRepository.findById(productoId)
                    .orElse(null);

            if (producto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto con ID " + productoId + " no encontrado.");
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

                DetalleBoleta detalle = new DetalleBoleta();
                detalle.setProducto(producto);
                detalle.setCantidad(cantidadSolicitada);
                detalle.setPrecioUnitario(precioUnitario);
                detalle.setSubtotalDetalle(subtotalDetalle);
                detallesBoleta.add(detalle);
            }
        }

        if (mensajeStockInsuficiente.length() > 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mensajeStockInsuficiente.toString());
        }

        
        String numeroBoleta = generarSiguienteNumeroBoleta();

        
        BigDecimal igvCalculado = subtotalGeneral.multiply(IGV_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalGeneral = subtotalGeneral.add(igvCalculado).setScale(2, RoundingMode.HALF_UP);

        
        Boleta boleta = new Boleta();
        boleta.setNumeroBoleta(numeroBoleta);
        boleta.setFechaEmision(LocalDateTime.now());
        boleta.setSubtotal(subtotalGeneral.setScale(2, RoundingMode.HALF_UP));
        boleta.setIgv(igvCalculado);
        boleta.setTotal(totalGeneral);
        boleta.setDetalles(detallesBoleta);

        
        boletaRepository.save(boleta);

        
        StringBuilder mensajeBoleta = new StringBuilder();
        mensajeBoleta.append("--- BOLETA DE VENTA ---\n");
        mensajeBoleta.append("Número de Boleta: ").append(boleta.getNumeroBoleta()).append("\n");
        mensajeBoleta.append("Fecha de Emisión: ").append(boleta.getFechaEmision()).append("\n\n");
        mensajeBoleta.append("Detalle de Productos:\n");

        for (DetalleBoleta detalle : detallesBoleta) {
            detalle.setBoleta(boleta); 
            detalleBoletaRepository.save(detalle); 

            // Actualizar stock del producto
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepository.save(producto);

            mensajeBoleta.append("- ").append(producto.getNombre())
                    .append(" (x").append(detalle.getCantidad()).append("): ")
                    .append(detalle.getPrecioUnitario()).append(" c/u - Subtotal: ")
                    .append(detalle.getSubtotalDetalle().setScale(2, RoundingMode.HALF_UP)).append("\n");
        }

        mensajeBoleta.append("\n");
        mensajeBoleta.append("Subtotal: S/ ").append(boleta.getSubtotal()).append("\n");
        mensajeBoleta.append("IGV (18%): S/ ").append(boleta.getIgv()).append("\n");
        mensajeBoleta.append("Total a Pagar: S/ ").append(boleta.getTotal()).append("\n");
        mensajeBoleta.append("-----------------------\n");

        return ResponseEntity.ok(mensajeBoleta.toString());
    }

    private String generarSiguienteNumeroBoleta() {
        Boleta ultimaBoleta = boletaRepository.findTopByOrderByFechaEmisionDesc();
        int ultimoNumero = 0;
        if (ultimaBoleta != null && ultimaBoleta.getNumeroBoleta() != null) {
            try {
                ultimoNumero = Integer.parseInt(ultimaBoleta.getNumeroBoleta());
            } catch (NumberFormatException e) {
                
                System.err.println("Error al parsear el número de boleta: " + ultimaBoleta.getNumeroBoleta());
                
            }
        }
        return String.format("%04d", ultimoNumero + 1);
    }

    @GetMapping("/historial")
    @PreAuthorize("hasAnyRole('COMPRADOR')")
    @Transactional
    public ResponseEntity<?> obtenerHistorialBoletas(Principal principal) {
        Uuser usuario = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<Boleta> historial = boletaRepository.findByUsuario(usuario);
        return ResponseEntity.ok(historial);
    }
}
