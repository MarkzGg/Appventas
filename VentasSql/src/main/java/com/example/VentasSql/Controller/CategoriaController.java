package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.Categoria;
import com.example.VentasSql.Repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER','ADMIN')") // Ajusta los roles según tu necesidad
public class CategoriaController {
    private final CategoriaRepository categoriaRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede crear categorías
    public Categoria crear(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @GetMapping
    @PreAuthorize("permitAll()") // Accesible por todos para listar categorías en el frontend
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede actualizar categorías
    public Categoria actualizar(@PathVariable Long id, @RequestBody Categoria data) {
        Categoria c = categoriaRepository.findById(id).orElseThrow();
        c.setNombre(data.getNombre());
        return categoriaRepository.save(c);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Solo ADMIN puede eliminar categorías
    public void eliminar(@PathVariable Long id) {
        categoriaRepository.deleteById(id);
    }
}
