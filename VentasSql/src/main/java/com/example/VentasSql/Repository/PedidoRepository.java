package com.example.VentasSql.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.VentasSql.Model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}