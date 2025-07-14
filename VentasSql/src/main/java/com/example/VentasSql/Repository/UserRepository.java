package com.example.VentasSql.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.VentasSql.Entidad.Uuser;

public interface UserRepository extends JpaRepository<Uuser, Long>{
    Optional <Uuser> findByUsername (String username);

}
