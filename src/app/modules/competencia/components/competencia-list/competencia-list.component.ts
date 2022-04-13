import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PageNotificationService} from '@nuvem/primeng-components';
import {ConfirmationService} from 'primeng';
import {Competencia} from 'src/app/domain/competencia/competencia.model';
import {CompetenciaService} from 'src/app/shared/services/competencia.service';
import {CompetenciaFormComponent} from '../competencia-form/competencia-form.component';


@Component({
    selector: 'app-competencia-list',
    templateUrl: './competencia-list.component.html',
    styleUrls: ['./competencia-list.component.css']
})
export class CompetenciaListComponent implements OnInit {

    competencia: Competencia;
    competencias: Competencia[] = [];
    displayModal: Boolean = false;
    // @BlockUI() blockUI: BlockUI
    @ViewChild(CompetenciaFormComponent, {static: false}) compForm: CompetenciaFormComponent;

    constructor(
        private competenciaService: CompetenciaService,
        private cd: ChangeDetectorRef,
        private messageService: PageNotificationService,
        private confirmationDialog: ConfirmationService
    ) {}

    ngOnInit() {
        this.listarCompetencias();
    }

    listarCompetencias() {
        return this.competenciaService.listar().subscribe(
            competencia => this.competencias = competencia,
            (err: HttpErrorResponse) => {
                this.messageService.addErrorMessage('Não foi possível listar as competências.');
            }
        );
    }

    novaCompetencia() {
        this.competencia = undefined;
        this.exibirModal();
    }

    submitForm(competencia: Competencia) {
        if (!this.competencia) {
            this.salvarCompetencia();
        } else {
            this.atualizarCompetencia();
        }
    }

    salvarCompetencia() {
        const competencia: Competencia = this.compForm.competenciaForm.value;
        this.competenciaService.salvar(competencia).subscribe(result => {
            this.competencias.push(result);
            this.fecharModal();
            this.messageService.addCreateMsg('Competência criada com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage);
        });
    }

    atualizarCompetencia() {
        const competencia: Competencia = this.compForm.competenciaForm.value;
        this.competenciaService.atualizar(competencia.id, competencia).subscribe(result => {
            const idx = this.competencias.indexOf(this.competencia);
            this.competencias[idx] = result;
            this.competencias = [...this.competencias];
            this.fecharModal();
            this.messageService.addUpdateMsg('Competência atualizada com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage);
        });
    }

    excluir(competencia: Competencia) {
        this.confirmationDialog.confirm({
            header: 'Confirmar exclusão',
            message: 'Deseja realmente excluir essa competência?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.competenciaService.excluir(competencia.id).subscribe(() => {
                    this.competencias = this.competencias.filter(c => c.id !== competencia.id);
                    this.messageService.addDeleteMsg('Competência excluida com sucesso!');
                }, (err: HttpErrorResponse) => {
                    this.messageService.addErrorMessage(err.error.detail, err.error.title);
                });
            },
            reject: () => {
                this.confirmationDialog.close();
            }
        });
    }

    editarCompetencia(competencia: Competencia) {
        this.competencia = competencia;
        this.exibirModal();
    }

    exibirModal() {
        this.displayModal = true;
        this.cd.markForCheck();
    }

    fecharModal() {
        this.displayModal = false;
    }
}
