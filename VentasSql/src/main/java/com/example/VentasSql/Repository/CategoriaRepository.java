package com.example.VentasSql.Repository;

import com.example.VentasSql.Entidad.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}