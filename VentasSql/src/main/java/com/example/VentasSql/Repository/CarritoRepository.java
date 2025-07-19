package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.CarritoItem;
import com.example.VentasSql.Entidad.Uuser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public interface CarritoRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuario(Uuser usuario);
    @Transactional
    void deleteByUsuario(Uuser usuario);
     // Asegura que la operación de eliminación se ejecute dentro de una transacción
    
}
