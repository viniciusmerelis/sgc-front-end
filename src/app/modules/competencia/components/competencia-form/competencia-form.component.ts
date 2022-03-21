import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../models/categoria.model';
import { Competencia } from '../../models/competencia.model';
import { CategoriaService } from '../../service/categoria.service';

@Component({
  selector: 'app-competencia-form',
  templateUrl: './competencia-form.component.html',
  styleUrls: ['./competencia-form.component.css']
})
export class CompetenciaFormComponent implements OnInit {

  categorias: Categoria[];
  disabilitarBotaoSalvar: boolean;
  competenciaForm: FormGroup;
  @Input() displayModal: boolean = false;
  @Input() competencia: Competencia;
  @Output() onSubmit = new EventEmitter<Competencia>()

  constructor(
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit() {
    this.listarCategorias();
    this.criarCompetenciaForm();
    if (this.competencia == undefined) {
      this.competenciaForm.setValue({
        id: null,
        nome: null,
        descricao: null,
        categoria: null
      })
    } else {
      this.competenciaForm.setValue(this.competencia);
    }
    this.disabilitarBotaoSalvar = false;
  }

  criarCompetenciaForm() {
    this.competenciaForm = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      descricao: new FormControl(null, [Validators.required,Validators.minLength(5)]),
      categoria: new FormControl(null, Validators.required)
    });
  }

  listarCategorias() {
    return this.categoriaService.listar().subscribe(
      categoria => {
        this.categorias = categoria
      }
    );
  }

  submit() {
    const competencia: Competencia = this.competenciaForm.value;
    this.disabilitarBotaoSalvar = true;
    this.onSubmit.next(competencia)
  }

  deveMostrarMensagemDeValidacao(control: AbstractControl): boolean {
    return control.errors && control.touched || control.dirty;
  }

  mensagemDeValidacao(control: AbstractControl) {
    if (control.hasError('required')) {
      return 'Campo obrigatório.';
    }
    if (control.hasError('minlength')) {
      return `O tamanho minímo é de ${control.getError('minlength').requiredLength} caracteres.`
    }
    return '';
  }

}
