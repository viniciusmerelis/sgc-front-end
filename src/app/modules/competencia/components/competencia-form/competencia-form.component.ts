import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng';
import { Competencia } from '../../models/competencia.model';
import { CategoriaService } from '../../service/categoria.service';
import { CompetenciaService } from '../../service/competencia.service';

@Component({
  selector: 'app-competencia-form',
  templateUrl: './competencia-form.component.html',
  styleUrls: ['./competencia-form.component.css']
})
export class CompetenciaFormComponent implements OnInit {

  categorias: SelectItem[];
  competenciaForm: FormGroup;
  @Input() displayModal: boolean = false;
  @Input() competencia: Competencia;

  constructor(
    private competenciaService: CompetenciaService,
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit() {
    this.listarCategorias();
    this.criarCompetenciaForm();
  }

  criarCompetenciaForm() {
    this.competenciaForm = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl(null, Validators.required),
      descricao: new FormControl(null, Validators.required),
      categoria: new FormControl(null, Validators.required)
    })
  }

  listarCategorias() {
    return this.categoriaService.buscarCategoriasSelectItem().subscribe(
      categoria => this.categorias = categoria
    );
  }

}
