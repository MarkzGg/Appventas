package com.example.VentasSql.Repository;

import com.example.VentasSql.Model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Consulta ya existente para productos con bajo stock
    @Query("SELECT p FROM Producto p WHERE p.stock < 5")
    List<Producto> findProductosConBajoStock();

    // Nueva consulta para buscar productos cuya descripción contenga una palabra clave (ignorando mayúsculas/minúsculas)
    // Spring Data JPA puede derivar esta consulta automáticamente por el nombre del método
    List<Producto> findByDescripcionContainingIgnoreCase(String keyword);

    // Opcional: Si prefieres JPQL explícito para la búsqueda por descripción
    /*
    @Query("SELECT p FROM Producto p WHERE LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Producto> buscarPorDescripcion(@Param("keyword") String keyword);
    */
}