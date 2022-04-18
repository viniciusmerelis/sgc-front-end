import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {PageNotificationService} from '@nuvem/primeng-components';
import {BlockUIService} from 'ng-block-ui';
import {ConfirmationService} from 'primeng';
import {Colaborador} from 'src/app/domain/colaborador/colaborador.model';
import {ColaboradorService} from '../../../../shared/services/colaborador.service';
import {ColaboradorFormComponent} from '../colaborador-form/colaborador-form.component';


@Component({
    selector: 'app-colaborador-list',
    templateUrl: './colaborador-list.component.html',
    styleUrls: ['./colaborador-list.component.css']
})
export class ColaboradorListComponent implements OnInit {

    colaborador: Colaborador;
    colaboradores: Colaborador[] = [];
    displayModal: Boolean = false;
    @ViewChild(ColaboradorFormComponent, {static: false}) colabForm: ColaboradorFormComponent;

    constructor(
        private colaboradorService: ColaboradorService,
        private messageService: PageNotificationService,
        private blockUI: BlockUIService,
        private confirmationDialog: ConfirmationService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.listarColaboradores();
    }

    listarColaboradores() {
        return this.colaboradorService.listar().subscribe(
            colaborador => {
                this.colaboradores = colaborador;
            }, (err: HttpErrorResponse) => {
                this.messageService.addErrorMessage('Não foi possível listar os colaboradores.');
            }
        );
    }

    submitForm(colaborador: Colaborador) {
        if (!this.colaborador) {
            this.salvarColaborador(colaborador);
        } else {
            this.atualizarColaborador(colaborador);
        }
    }

    salvarColaborador(colaborador: Colaborador) {
        this.colaboradorService.salvar(colaborador).subscribe(result => {
            this.fecharModal();
            this.listarColaboradores();
            this.messageService.addCreateMsg('Colaborador criado com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });
    }

    atualizarColaborador(colaborador: Colaborador) {
        this.colaboradorService.atualizar(colaborador.id, colaborador).subscribe(result => {
            this.fecharModal();
            this.listarColaboradores();
            this.messageService.addUpdateMsg('Colaborador atualizado com sucesso!');
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
        });

    }

    excluir(colaborador: Colaborador) {
        this.confirmationDialog.confirm({
            header: 'Confirmar exclusão',
            message: 'Deseja realmente excluir esse colaborador?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.colaboradorService.excluir(colaborador.id).subscribe(() => {
                    this.colaboradores = this.colaboradores.filter(c => c.id !== colaborador.id);
                    this.messageService.addDeleteMsg('Colaborador excluido com sucesso!');
                }, (err: HttpErrorResponse) => {
                    this.messageService.addErrorMessage(err.error.detail, err.error.title);
                });
            },
            reject: () => {
                this.confirmationDialog.close();
            }
        });
    }

    novoColaborador() {
        this.colaborador = undefined;
        this.exibirModal();
    }

    editarColaborador(colaboradorId: number) {
        this.colaboradorService.buscarPeloId(colaboradorId).subscribe(colaborador => {
            this.colaborador = colaborador;
            this.exibirModal();
        }, (err: HttpErrorResponse) => {
            this.messageService.addErrorMessage(err.error.detail);
        });
    }

    exibirModal() {
        this.displayModal = true;
        this.cd.markForCheck();
    }

    fecharModal() {
        this.displayModal = false;
    }
}
