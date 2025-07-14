package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByProductoIdAndAprobadoTrue(Long productoId);
}