import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng';
import { Competencia } from '../../models/competencia.model';
import { CompetenciaService } from '../../service/competencia.service';
import { CompetenciaFormComponent } from '../competencia-form/competencia-form.component';

@Component({
    selector: 'app-competencia-list',
    templateUrl: './competencia-list.component.html',
    styleUrls: ['./competencia-list.component.css']
})
export class CompetenciaListComponent implements OnInit {

    competencia: Competencia;
    competencias: Competencia[] = [];
    categorias: SelectItem[];
    displayModal: boolean = false;
    @ViewChild(CompetenciaFormComponent, {static: false}) compForm: CompetenciaFormComponent

    constructor(
        private competenciaService: CompetenciaService,
        private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.listarCompetencias();
    }

    listarCompetencias() {
        return this.competenciaService.listar().subscribe(
            competencia => this.competencias = competencia
        );
    }

    novaCompetencia() {
        this.competencia = undefined;
        this.showModal();
    }

    editarCompetencia(competencia: Competencia) {
        this.competencia = competencia;
        setTimeout(() => {
            this.showModal();
        })
    }

    excluir(competencia: Competencia) {
        return this.competenciaService.excluir(competencia.id).subscribe(() => {
            this.competencias = this.competencias.filter(c => c.id !== competencia.id)
        });
    }

    salvarCompetencia(competencia: Competencia) {
        // todo: fazer as validações

        // todo: se falhar, exibir mensagem e sair
        // exibir de erro: dar um return;

        // se ok,
        if (!this.competencia) {
            // novo
            this.competenciaService.salvar(competencia as any)
            .subscribe((result)=>{
                this.competencias = [...this.competencias, result];
                this.fecharModal();
                // todo: exibir mensagem salvo com sucesso
            }, (err: HttpErrorResponse)=>{
                // todo: mensagems de error
            })

        } else {
            // editando
            this.competenciaService.atualizar(competencia.id, competencia as any)
            .subscribe((result)=>{
                const idx = this.competencias.indexOf(this.competencia)
                this.competencias[idx]= result
                this.competencias = [...this.competencias]
                this.fecharModal();
                 // todo: exibir mensagem salvo com sucesso
            }, (err: HttpErrorResponse)=>{
                // todo: mensagems de error
            })

        }


    }

    showModal() {
        this.displayModal = true;
        this.cd.markForCheck();
    }

    fecharModal() {
        this.displayModal = false;
    }

}
