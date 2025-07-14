package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    Boleta findTopByOrderByFechaEmisionDesc(); 
}
