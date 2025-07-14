package com.example.VentasSql.Controller;

import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // --- Endpoints CRUD Básicos (ya existentes) ---

    // GET /productos - Obtener todos los productos
    @GetMapping
    @PreAuthorize("hasAnyRole('COMPRADOR', 'USER', 'ADMIN')") // Accesible por USER y ADMIN
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    // GET /productos/{id} - Obtener un producto por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPRADOR','USER', 'ADMIN')") // Accesible por USER y ADMIN
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(producto -> new ResponseEntity<>(producto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // POST /productos - Crear un nuevo producto
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede crear productos
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        Producto newProducto = productoService.createProducto(producto);
        return new ResponseEntity<>(newProducto, HttpStatus.CREATED);
    }

    // PUT /productos/{id} - Actualizar un producto completo
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede actualizar productos completos
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        Producto updatedProducto = productoService.updateProducto(id, productoDetails);
        return updatedProducto != null ?
                new ResponseEntity<>(updatedProducto, HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // PUT /productos/{id}/stock - Actualizar el stock
    @PutMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // USER y ADMIN pueden actualizar stock
    public ResponseEntity<Producto> updateProductoStock(@PathVariable Long id, @RequestParam Integer nuevoStock) {
        return productoService.updateProductoStock(id, nuevoStock)
                .map(producto -> new ResponseEntity<>(producto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // PUT /productos/{id}/precio - Actualizar el precio
    @PutMapping("/{id}/precio")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // USER y ADMIN pueden actualizar precio
    public ResponseEntity<Producto> updateProductoPrecio(@PathVariable Long id, @RequestParam Double nuevoPrecio) {
        return productoService.updateProductoPrecio(id, nuevoPrecio)
                .map(producto -> new ResponseEntity<>(producto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // DELETE /productos/{id} - Eliminar un producto
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede eliminar productos
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // --- Nuevas Rutas ---

    /**
     * GET /productos/bajo-stock
     * Descripción: Obtiene todos los productos cuyo stock es menor a 5.
     * Permisos: Accesible para usuarios con rol 'USER' o 'ADMIN'.
     */
    @GetMapping("/bajo-stock")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')") // USER y ADMIN pueden ver el bajo stock
    public ResponseEntity<List<Producto>> getProductosConBajoStock() {
        List<Producto> productos = productoService.getProductosConBajoStock();
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }

    /**
     * GET /productos/buscar
     * Descripción: Busca productos cuya descripción contenga la palabra clave especificada.
     * Ejemplo: /productos/buscar?keyword=telefono
     * Permisos: Accesible para usuarios con rol 'USER' o 'ADMIN'.
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('COMPRADOR','USER', 'ADMIN')") // USER y ADMIN pueden buscar productos
    public ResponseEntity<List<Producto>> searchProductosByDescription(@RequestParam String keyword) {
        List<Producto> productos = productoService.searchProductosByDescription(keyword);
        return new ResponseEntity<>(productos, HttpStatus.OK);
    }
}