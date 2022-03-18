import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng';
import { CategoriaService } from '../../service/categoria.service';
import { CompetenciaService } from '../../service/competencia.service';

@Component({
  selector: 'app-competencia-form',
  templateUrl: './competencia-form.component.html',
  styleUrls: ['./competencia-form.component.css']
})
export class CompetenciaFormComponent implements OnInit {

  categorias: SelectItem[];

  constructor(
    private competenciaService: CompetenciaService,
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit() {

  }

  listarCategorias() {
    return this.categoriaService.buscarCategoriasSelectItem().subscribe(
      categoria => this.categorias = categoria
    );
  }

}
