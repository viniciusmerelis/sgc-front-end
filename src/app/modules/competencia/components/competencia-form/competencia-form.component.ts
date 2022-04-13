import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Categoria} from 'src/app/domain/competencia/categoria.model';
import {Competencia} from 'src/app/domain/competencia/competencia.model';
import {CategoriaService} from '../../../../shared/services/categoria.service';

@Component({
    selector: 'app-competencia-form',
    templateUrl: './competencia-form.component.html',
    styleUrls: ['./competencia-form.component.css']
})
export class CompetenciaFormComponent implements OnInit {

    categorias: Categoria[];
    competenciaForm: FormGroup;
    @Input() displayModal: Boolean = false;
    @Input() competencia: Competencia;
    @Output() onSubmit = new EventEmitter<Competencia>();

    constructor(
        private categoriaService: CategoriaService,
    ) {
    }

    ngOnInit() {
        this.listarCategorias();
        this.criarCompetenciaForm();
        this.definirCompetenciaForm();
    }

    criarCompetenciaForm() {
        this.competenciaForm = new FormGroup({
            id: new FormControl(null),
            nome: new FormControl(null, [Validators.required, Validators.minLength(2)]),
            descricao: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            categoria: new FormControl(null, Validators.required)
        });
    }

    definirCompetenciaForm() {
        if (!this.competencia) {
            this.competenciaForm.setValue({
                id: null,
                nome: null,
                descricao: null,
                categoria: null
            });
        } else {
            this.competenciaForm.setValue(this.competencia);
        }
    }

    listarCategorias() {
        return this.categoriaService.listar().subscribe(categoria => {
                this.categorias = categoria
            }
        );
    }

    submit() {
        const competencia: Competencia = this.competenciaForm.value;
        this.onSubmit.next(competencia);
    }

    deveMostrarMensagemDeValidacao(control: AbstractControl): boolean {
        return control.errors && control.touched || control.dirty;
    }

    mensagemDeValidacao(control: AbstractControl) {
        if (control.hasError('required')) {
            return 'Campo obrigatório.';
        }
        if (control.hasError('minlength')) {
            return `O tamanho minímo é de ${control.getError('minlength').requiredLength} caracteres.`;
        }
        return '';
    }

}
