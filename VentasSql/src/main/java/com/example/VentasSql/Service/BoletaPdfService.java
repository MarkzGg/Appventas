package com.example.VentasSql.Service;

import com.example.VentasSql.Entidad.Pedido;
import com.example.VentasSql.Entidad.DetallePedido; // Asegúrate de importar DetallePedido
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;    
import com.lowagie.text.Paragraph;
import java.awt.Color; 
import java.math.BigDecimal;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter; // Para formatear la fecha

@Service
public class BoletaPdfService {

    public byte[] generarPdfBoleta(Pedido pedido) throws IOException, DocumentException {
        // Usa ByteArrayOutputStream para escribir el PDF en memoria
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // 1. Crear el documento
        Document document = new Document(PageSize.A4); // Tamaño de página A4
        PdfWriter.getInstance(document, baos);

        document.open(); // Abrir el documento para escribir

        // 2. Definir fuentes y colores
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

        // 3. Agregar encabezado/título de la boleta
        Paragraph title = new Paragraph("BOLETA DE VENTA", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Información de la empresa (ejemplo)
        document.add(new Paragraph("Mi Tienda S.A.C.", headerFont));
        document.add(new Paragraph("RUC: 20XXXXXXXXX", normalFont));
        document.add(new Paragraph("Dirección: Av. Principal 123, Lima, Perú", normalFont));
        document.add(new Paragraph("Teléfono: (01) 123 4567", normalFont));
        document.add(new Paragraph("Email: ventas@mitienda.com", normalFont));
        document.add(Chunk.NEWLINE); // Salto de línea

        // Información del Pedido y Cliente
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        document.add(new Paragraph("Número de Pedido: " + pedido.getId(), boldFont));
        document.add(new Paragraph("Fecha y Hora: " + pedido.getFechaPedido().format(formatter), normalFont));
        document.add(new Paragraph("Cliente: " + pedido.getUsuario().getUsername(), normalFont)); // Asume que Uuser tiene un getUsername()
        document.add(Chunk.NEWLINE);

        // 4. Detalles del Pedido (Tabla)
        // Puedes usar PdfPTable si quieres una tabla más avanzada con iText, pero para empezar,
        // usaremos una tabla simple con Paragraphs.
        // Para una tabla más robusta: import com.lowagie.text.pdf.PdfPTable;
        // PdfPTable table = new PdfPTable(4); // 4 columnas: Producto, Cantidad, Precio Unitario, Subtotal
        // table.setWidthPercentage(100); // Ancho de la tabla al 100% de la página

        document.add(new Paragraph("Detalles del Pedido:", headerFont));
        document.add(Chunk.NEWLINE);

        // Encabezados de la tabla (simple con texto)
        document.add(new Paragraph(
            String.format("%-40s %-10s %-15s %-15s", "Producto", "Cantidad", "P. Unitario", "Subtotal"),
            boldFont
        ));
        document.add(new Paragraph("-------------------------------------------------------------------------------------------------", normalFont));

        for (DetallePedido detalle : pedido.getDetalles()) {
            document.add(new Paragraph(
                String.format("%-40s %-10s S/ %-12.2f S/ %-12.2f",
                    detalle.getProducto().getNombre(),
                    detalle.getCantidad(),
                    detalle.getPrecioUnitario(),
                    detalle.getSubtotalDetalle()),
                normalFont
            ));
        }
        document.add(new Paragraph("-------------------------------------------------------------------------------------------------", normalFont));
        document.add(Chunk.NEWLINE);

        // Totales
        document.add(new Paragraph("Subtotal: S/ " + pedido.getTotal().divide(new BigDecimal("1.18"), 2, java.math.RoundingMode.HALF_UP), boldFont)); // Calcula subtotal sin IGV si el total incluye IGV
        document.add(new Paragraph("IGV (18%): S/ " + pedido.getTotal().multiply(new BigDecimal("0.18")).divide(new BigDecimal("1.18"), 2, java.math.RoundingMode.HALF_UP), boldFont)); // Calcula IGV
        document.add(new Paragraph("Total a Pagar: S/ " + pedido.getTotal().setScale(2, java.math.RoundingMode.HALF_UP), titleFont));
        document.add(Chunk.NEWLINE);

        // Pie de página
        document.add(new Paragraph("¡Gracias por su compra!", normalFont));
        document.add(new Paragraph("Este es un documento no tributario válido como boleta de venta.", normalFont));


        document.close(); // Cerrar el documento

        return baos.toByteArray(); // Devolver el PDF como un array de bytes
    }
}