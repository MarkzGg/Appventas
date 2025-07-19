package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Pedido;
import com.example.VentasSql.Entidad.Uuser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Uuser usuario);
}
