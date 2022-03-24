import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService } from 'primeng';
import { Turma } from 'src/app/domain/turma-formacao/turma.model';
import { TurmaFormacaoService } from 'src/app/shared/services/turma-formacao.service';



@Component({
  selector: 'app-turma-formacao-list',
  templateUrl: './turma-formacao-list.component.html',
  styleUrls: ['./turma-formacao-list.component.css']
})
export class TurmaFormacaoListComponent implements OnInit {

  turmas: Turma[] = [];

  constructor(
    private turmaService: TurmaFormacaoService,
    private messageService: PageNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationDialog: ConfirmationService
  ) { }

  ngOnInit() {
    this.listarTurmas();
  }

  listarTurmas() {
    return this.turmaService.listar().subscribe(
      turma => {
        this.turmas = turma
      }, (err: HttpErrorResponse) => {
        this.messageService.addErrorMessage('Não foi possível listar as turmas');
      }
    );
  }

  excluirTurma(turma: Turma) {
    this.confirmationDialog.confirm({
      header: 'Confirmar exclusão',
      message: "Deseja realmente excluir essa turma?",
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

  navigateTo(param: number) {
    this.router.navigate([`${param}`], { relativeTo: this.route });
  }

}
