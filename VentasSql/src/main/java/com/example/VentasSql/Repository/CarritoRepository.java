package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.CarritoItem;
import com.example.VentasSql.Entidad.Uuser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarritoRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuario(Uuser usuario);
    void deleteByUsuario(Uuser usuario);
}
