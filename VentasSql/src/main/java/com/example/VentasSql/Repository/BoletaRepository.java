package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Boleta;
import com.example.VentasSql.Entidad.Uuser;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    Boleta findTopByOrderByFechaEmisionDesc(); 
    List<Boleta> findByUsuario(Uuser usuario);
    @Query("SELECT b FROM Boleta b LEFT JOIN FETCH b.usuario u LEFT JOIN FETCH b.detalles d LEFT JOIN FETCH d.producto")
    List<Boleta> findAllWithUserAndDetails();

}
