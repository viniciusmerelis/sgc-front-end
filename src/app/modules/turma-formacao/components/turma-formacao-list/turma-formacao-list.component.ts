import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, ViewChild} from '@angular/core';
import {PageNotificationService} from '@nuvem/primeng-components';
import {ConfirmationService} from 'primeng';
import {Turma} from 'src/app/domain/turma-formacao/turma.model';
import {TurmaFormacaoService} from 'src/app/shared/services/turma-formacao.service';
import {TurmaFormacaoFormComponent} from '../turma-formacao-form/turma-formacao-form.component';


@Component({
    selector: 'app-turma-formacao-list',
    templateUrl: './turma-formacao-list.component.html',
    styleUrls: ['./turma-formacao-list.component.css']
})
export class TurmaFormacaoListComponent implements OnInit {

    turma: Turma;
    turmas: Turma[] = [];
    displayModal: Boolean = false;
    @ViewChild(TurmaFormacaoFormComponent, {static: false}) turmForm: TurmaFormacaoFormComponent;

    constructor(
        private turmaService: TurmaFormacaoService,
        private messageService: PageNotificationService,
        private confirmationDialog: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.listarTurmas();
    }

    listarTurmas() {
        return this.turmaService.listar().subscribe(turma => {
            this.turmas = turma
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });
    }

    submitForm(turma: Turma) {
        if (!this.turma) {
            this.salvarTurma(turma);
        } else {
            this.atualizarTurma(turma);
        }
    }

    salvarTurma(turma: Turma) {
        this.turmaService.salvar(turma).subscribe(() => {
            this.fecharModal();
            this.listarTurmas();
            this.messageService.addCreateMsg('Turma salva com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });
    }

    atualizarTurma(turma: Turma) {
        this.turmaService.atualizar(turma.id, turma).subscribe(() => {
            this.fecharModal();
            this.listarTurmas();
            this.messageService.addUpdateMsg('Turma atualizada com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });
    }

    excluirTurma(turma: Turma) {
        this.confirmationDialog.confirm({
            header: 'Confirmar exclusão',
            message: 'Deseja realmente excluir essa turma?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.turmaService.excluir(turma.id).subscribe(() => {
                    this.turmas = this.turmas.filter(t => t.id !== turma.id);
                    this.messageService.addDeleteMsg('Turma excluida com sucesso!');
                }, (err: HttpErrorResponse) => {
                    this.messageService.addErrorMessage(err.error.detail, err.error.title);
                });
            },
            reject: () => {
                this.confirmationDialog.close();
            }
        });
    }

    novaTurma() {
        this.turma = undefined;
        this.exibirModal();
    }

    editarTurma(turmaId: number): void {
        this.turmaService.buscarPeloId(turmaId).subscribe(turma => {
            this.turma = turma;
            this.exibirModal();
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });
    }

    exibirModal() {
        this.displayModal = true;
    }

    fecharModal() {
        this.displayModal = false;
    }

}
