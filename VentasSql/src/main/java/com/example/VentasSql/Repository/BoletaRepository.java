package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Boleta;
import com.example.VentasSql.Entidad.Uuser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    Boleta findTopByOrderByFechaEmisionDesc(); 
    List<Boleta> findByUsuario(Uuser usuario);

}
