package com.example.VentasSql.Service;

import com.example.VentasSql.Model.Producto;
import com.example.VentasSql.Repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Método para obtener todos los productos
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // Método para obtener un producto por ID
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    // Método para crear un producto
    @Transactional
    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Método para actualizar un producto (ejemplo de @Transactional si actualiza entidades relacionadas)
    // Para una simple actualización, @Transactional es opcional pero buena práctica
    @Transactional
    public Producto updateProducto(Long id, Producto productoDetails) {
        return productoRepository.findById(id).map(producto -> {
            producto.setNombre(productoDetails.getNombre());
            producto.setStock(productoDetails.getStock());
            producto.setDescripcion(productoDetails.getDescripcion());
            producto.setPrecio(productoDetails.getPrecio());
            return productoRepository.save(producto);
        }).orElse(null);
    }

    // Método para actualizar el stock de un producto
    @Transactional
    public Optional<Producto> updateProductoStock(Long id, Integer nuevoStock) {
        return productoRepository.findById(id).map(producto -> {
            producto.setStock(nuevoStock);
            return productoRepository.save(producto);
        });
    }

    // Método para actualizar el precio de un producto
    @Transactional
    public Optional<Producto> updateProductoPrecio(Long id, Double nuevoPrecio) {
        return productoRepository.findById(id).map(producto -> {
            producto.setPrecio(BigDecimal.valueOf(nuevoPrecio));
            return productoRepository.save(producto);
        });
    }

    // Método para eliminar un producto
    @Transactional
    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    // --- Nuevos Métodos para las Consultas Personalizadas ---

    // Método para obtener productos con menos de 5 de stock
    public List<Producto> getProductosConBajoStock() {
        return productoRepository.findProductosConBajoStock();
    }

    // Método para buscar productos por palabra clave en la descripción
    public List<Producto> searchProductosByDescription(String keyword) {
        return productoRepository.findByDescripcionContainingIgnoreCase(keyword);
        // Si usaste el método @Query con @Param, sería:
        // return productoRepository.buscarPorDescripcion(keyword);
    }
}