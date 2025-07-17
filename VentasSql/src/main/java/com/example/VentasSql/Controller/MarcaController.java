package com.example.VentasSql.Controller;

import com.example.VentasSql.Entidad.Marca;
import com.example.VentasSql.Repository.MarcaRepository;    
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/marcas")
@RequiredArgsConstructor

public class MarcaController {
    private final MarcaRepository marcaRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Marca crear(@RequestBody Marca marca) {
        return marcaRepository.save(marca);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Marca> listar() {
        return marcaRepository.findAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Marca actualizar(@PathVariable Long id, @RequestBody Marca data) {
        Marca m = marcaRepository.findById(id).orElseThrow();
        m.setNombre(data.getNombre());
        return marcaRepository.save(m);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        marcaRepository.deleteById(id);
    }
}
