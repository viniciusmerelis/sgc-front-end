import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { BlockUIService } from 'ng-block-ui';
import { ConfirmationService } from 'primeng';
import { Colaborador } from 'src/app/domain/colaborador/colaborador.model';
import { ColaboradorService } from '../../../../shared/services/colaborador.service';


@Component({
    selector: 'app-colaborador-list',
    templateUrl: './colaborador-list.component.html',
    styleUrls: ['./colaborador-list.component.css']
})
export class ColaboradorListComponent implements OnInit {

    colaboradores: Colaborador[] = [];

    constructor(
        private colaboradorService: ColaboradorService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: PageNotificationService,
        private blockUI: BlockUIService,
        private confirmationDialog: ConfirmationService
    ) { }

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

    editar(colaboradorId: number) {
        this.router.navigate([`${colaboradorId}`], { relativeTo: this.route });
    }
}
