package com.example.VentasSql.Controller;

import com.example.VentasSql.Dto.PedidoRequest;
import com.example.VentasSql.Entidad.Boleta;
import com.example.VentasSql.Entidad.DetalleBoleta;
import com.example.VentasSql.Entidad.Uuser;
import com.example.VentasSql.Entidad.Producto;
import com.example.VentasSql.Repository.BoletaRepository;
import com.example.VentasSql.Repository.DetalleBoletaRepository;
import com.example.VentasSql.Repository.ProductoRepository;
import com.example.VentasSql.Repository.UserRepository;
import com.example.VentasSql.Repository.PedidoRepository;
import com.example.VentasSql.Entidad.Pedido; // Asegúrate de importar tu entidad Pedido
import java.security.Principal;
import com.example.VentasSql.Service.BoletaPdfService; // Importa tu nuevo servicio de PDF
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // Importa MediaType
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin; // Importa CrossOrigin


import java.io.ByteArrayInputStream;
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
@CrossOrigin(origins = "http://localhost:4200") // ¡IMPORTANTE! Asegúrate de que esta anotación esté aquí
public class BoletaController {

    private final BoletaRepository boletaRepository;
    private final ProductoRepository productoRepository;
    private final DetalleBoletaRepository detalleBoletaRepository;
    private final UserRepository userRepository;
    private final BoletaPdfService boletaPdfService; // Inyecta el servicio de PDF
    private final PedidoRepository pedidoRepository; // Inyectar PedidoRepository

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    @PostMapping("/generar")
    @PreAuthorize("permitAll()") // Accesible por USER y ADMIN
    @Transactional
    
    public ResponseEntity<?> generarBoleta(@Valid @RequestBody List<PedidoRequest> pedidos, Principal principal) {
        try {
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

            // >>> ASIGNAR EL USUARIO A LA BOLETA <<<
// Necesitas el usuario logueado para asignar la boleta al comprador
// Si el usuario siempre está autenticado al generar una boleta, puedes usar Principal.
// Si no, debes pasar el ID de usuario en el PedidoRequest o de alguna otra forma.
// Ejemplo usando Principal:
            if (principal != null) {
                Uuser usuario = userRepository.findByUsername(principal.getName())
                                              .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado."));
                boleta.setUsuario(usuario);
            } else {
                // Manejo de caso donde no hay Principal (ej. para pruebas o si permites compras como invitado)
                // Podrías asignar un usuario por defecto o requerir que el usuario esté logueado
                System.err.println("Advertencia: Boleta generada sin usuario autenticado.");
            }
// <<< FIN ASIGNAR USUARIO >>>

            boletaRepository.save(boleta);

            for (DetalleBoleta detalle : detallesBoleta) {
                detalle.setBoleta(boleta);
                detalleBoletaRepository.save(detalle);

                // Actualizar stock del producto
                Producto producto = detalle.getProducto();
                producto.setStock(producto.getStock() - detalle.getCantidad());
                productoRepository.save(producto);
            }

            // Aquí se devuelve un mensaje de confirmación, no el PDF
            StringBuilder mensajeBoleta = new StringBuilder();
            mensajeBoleta.append("Boleta generada con éxito. Número de Boleta: ").append(boleta.getNumeroBoleta());
            return ResponseEntity.ok(Map.of("message", mensajeBoleta.toString(), "boletaId", boleta.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al generar la boleta: " + e.getMessage()));
        }
    }

    private String generarSiguienteNumeroBoleta() {
        Boleta ultimaBoleta = boletaRepository.findTopByOrderByFechaEmisionDesc();
        String ultimoNumeroStr = null;
        if (ultimaBoleta != null && ultimaBoleta.getNumeroBoleta() != null) {
            ultimoNumeroStr = ultimaBoleta.getNumeroBoleta().replaceAll("[^\\d]", ""); // Extraer solo dígitos
        }
        int ultimoNumero = 0;
        if (ultimoNumeroStr != null && !ultimoNumeroStr.isEmpty()) {
            try {
                ultimoNumero = Integer.parseInt(ultimoNumeroStr);
            } catch (NumberFormatException e) {
                System.err.println("Error al parsear el número de boleta: " + ultimaBoleta.getNumeroBoleta());
            }
        }
        // Asumiendo que el formato es "BOLETA-XXXX"
        return String.format("BOLETA-%05d", ultimoNumero + 1); // Formato de 5 dígitos
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> eliminarBoleta(@PathVariable Long id) {
        try {
            Boleta boleta = boletaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Boleta con ID " + id + " no encontrada."));
            // Opcional: Revertir stock de productos antes de eliminar la boleta
            for (DetalleBoleta detalle : boleta.getDetalles()) {
                Producto producto = detalle.getProducto();
                producto.setStock(producto.getStock() + detalle.getCantidad());
                productoRepository.save(producto);
            }
            boletaRepository.delete(boleta);
            return ResponseEntity.ok("Boleta eliminada correctamente. El stock de los productos ha sido revertido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la boleta: " + e.getMessage());
        }
    }

    @DeleteMapping("/eliminar-con-pedido/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> eliminarBoletaYPedido(@PathVariable Long id) {
        try {
            Boleta boleta = boletaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Boleta con ID " + id + " no encontrada."));
            // Buscar pedido asociado por id de boleta
            Pedido pedido = pedidoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pedido asociado a la boleta con ID " + id + " no encontrado."));
            // Revertir stock de productos de la boleta
            for (DetalleBoleta detalle : boleta.getDetalles()) {
                Producto producto = detalle.getProducto();
                producto.setStock(producto.getStock() + detalle.getCantidad());
                productoRepository.save(producto);
            }
            // Eliminar pedido y boleta
            pedidoRepository.delete(pedido);
            boletaRepository.delete(boleta);
            return ResponseEntity.ok("Boleta y pedido eliminados correctamente. El stock de los productos ha sido revertido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar boleta y pedido: " + e.getMessage());
        }
    }

    // >>> NUEVO ENDPOINT PARA DESCARGAR PDF <<<
    @GetMapping("/{id}/pdf") // Este es el endpoint que tu frontend de Angular está llamando
    @PreAuthorize("hasAnyRole('COMPRADOR', 'ADMIN')") // Permite acceso a compradores y administradores
    @Transactional
    public ResponseEntity<InputStreamResource> descargarBoletaPdf(@PathVariable Long id) {
        try {
            // 1. Buscar la boleta por ID
            Boleta boleta = boletaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Boleta con ID " + id + " no encontrada."));

            // 2. Generar el PDF usando el servicio
            byte[] pdfBytes = boletaPdfService.generarPdfBoleta(boleta);

            // 3. Preparar la respuesta HTTP para el PDF
            ByteArrayInputStream bis = new ByteArrayInputStream(pdfBytes);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta_" + boleta.getNumeroBoleta() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));

        } catch (RuntimeException e) { // Captura si la boleta no se encuentra
            System.err.println("Error al descargar PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Devuelve 404
        } catch (Exception e) { // Captura otros errores (ej. al generar el PDF)
            e.printStackTrace(); // Imprime la traza completa del error en la consola del servidor
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Devuelve 500
        }
    }
    /**
     * Nuevo endpoint para que los ADMIN obtengan todas las boletas.
     * Incluye los detalles de los productos y la información del usuario.
     */
    @GetMapping("/admin/todas")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Transactional // ¡IMPORTANTE! Esto asegura que las relaciones lazy se inicialicen
    public ResponseEntity<List<Boleta>> getAllBoletasForAdmin() {
        // Usamos el nuevo método del repositorio que carga las relaciones necesarias (usuario, detalles, producto)
        List<Boleta> boletas = boletaRepository.findAllWithUserAndDetails();
        return ResponseEntity.ok(boletas);
    }

}
