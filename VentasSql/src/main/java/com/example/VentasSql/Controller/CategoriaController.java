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

public class CategoriaController {
    private final CategoriaRepository categoriaRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Categoria crear(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Categoria actualizar(@PathVariable Long id, @RequestBody Categoria data) {
        Categoria c = categoriaRepository.findById(id).orElseThrow();
        c.setNombre(data.getNombre());
        return categoriaRepository.save(c);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        categoriaRepository.deleteById(id);
    }
}
