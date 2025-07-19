package com.example.VentasSql.Service; // O el paquete que elijas

import com.example.VentasSql.Entidad.Boleta;
import com.example.VentasSql.Entidad.DetalleBoleta;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class BoletaPdfService {

    public byte[] generarPdfBoleta(Boleta boleta) throws DocumentException {
        // Validación básica
        if (boleta == null) {
            throw new IllegalArgumentException("La boleta no puede ser nula para generar el PDF.");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Título
            document.add(new Paragraph("BOLETA DE VENTA"));
            document.add(new Paragraph("------------------------------------------------------------------"));
            document.add(new Paragraph("Número de Boleta: " + boleta.getNumeroBoleta()));
            document.add(new Paragraph("Fecha de Emisión: " + boleta.getFechaEmision().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
            
            // Asumiendo que Boleta puede tener un usuario asociado
            if (boleta.getUsuario() != null && boleta.getUsuario().getUsername() != null) {
                 document.add(new Paragraph("Cliente: " + boleta.getUsuario().getUsername()));
            } else {
                 document.add(new Paragraph("Cliente: (No especificado)"));
            }

            document.add(new Paragraph("------------------------------------------------------------------"));
            document.add(new Paragraph("Detalle de Productos:"));
            document.add(new Paragraph(" ")); // Espacio

            // Tabla de productos
            PdfPTable table = new PdfPTable(4); // 4 columnas: Producto, Cantidad, Precio Unitario, Subtotal
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Encabezados de la tabla
            table.addCell(new PdfPCell(new Phrase("Producto")));
            table.addCell(new PdfPCell(new Phrase("Cantidad")));
            table.addCell(new PdfPCell(new Phrase("P. Unitario")));
            table.addCell(new PdfPCell(new Phrase("Subtotal")));

            // Filas de la tabla
            for (DetalleBoleta detalle : boleta.getDetalles()) {
                table.addCell(new PdfPCell(new Phrase(detalle.getProducto().getNombre())));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(detalle.getCantidad()))));
                table.addCell(new PdfPCell(new Phrase("S/ " + detalle.getPrecioUnitario().setScale(2, BigDecimal.ROUND_HALF_UP))));
                table.addCell(new PdfPCell(new Phrase("S/ " + detalle.getSubtotalDetalle().setScale(2, BigDecimal.ROUND_HALF_UP))));
            }
            document.add(table);

            // Totales
            document.add(new Paragraph(" ")); // Espacio
            document.add(new Paragraph("Subtotal: S/ " + boleta.getSubtotal().setScale(2, BigDecimal.ROUND_HALF_UP)));
            document.add(new Paragraph("IGV (18%): S/ " + boleta.getIgv().setScale(2, BigDecimal.ROUND_HALF_UP)));
            document.add(new Paragraph("Total a Pagar: S/ " + boleta.getTotal().setScale(2, BigDecimal.ROUND_HALF_UP)));
            document.add(new Paragraph("------------------------------------------------------------------"));
            document.add(new Paragraph("Gracias por su compra!"));

        } finally {
            document.close();
        }

        return baos.toByteArray();
    }
}