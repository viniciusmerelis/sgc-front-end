import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Competencia } from 'src/app/modules/competencia/models/competencia.model';
import { CompetenciaService } from 'src/app/modules/competencia/service/competencia.service';
import { Senioridade } from '../../models/senioridade.model';
import { SenioridadeService } from '../../service/senioridade.service';

@Component({
    selector: 'app-colaborador-form',
    templateUrl: './colaborador-form.component.html',
    styleUrls: ['./colaborador-form.component.css']
})
export class ColaboradorFormComponent implements OnInit {

    senioridades: Senioridade[] = [];
    competencias: Competencia[] = [];
    colaboradorForm: FormGroup;
    competenciasForm: FormGroup;

    constructor(
        private senioridadeService: SenioridadeService,
        private competenicaService: CompetenciaService
    ) { }

    ngOnInit() {
        this.listarSenioridades();
        this.listarCompetencias();
        this.criarColaboradorForm();
    }

    criarColaboradorForm() {
        this.colaboradorForm = new FormGroup({
            id: new FormControl(),
            nome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            sobrenome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            cpf: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
            email: new FormControl(null, Validators.required),
            dataNascimento: new FormControl(null, Validators.required),
            dataAdmissao: new FormControl(null, Validators.required),
            senioridade: new FormControl(null, Validators.required),
            competencias: new FormControl(null, Validators.required)
        })
    }

    criarCompetenciasForm() {
        this.competenciasForm = new FormGroup({

        })
    }

    listarSenioridades() {
        return this.senioridadeService.listar().subscribe(
            senioridade => this.senioridades = senioridade
        );
    }

    listarCompetencias() {
        return this.competenicaService.listar().subscribe(
            competencia => this.competencias = competencia
        );
    }

}
