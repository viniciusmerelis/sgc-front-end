import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, SelectItem } from 'primeng';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColaboradorResumo } from 'src/app/domain/turma-formacao/colaborador-resumo.model';
import { CompetenciaColaborador } from 'src/app/domain/turma-formacao/competencia-colaborador.model';
import { CompetenciaColaboradoresNivelMaximo } from 'src/app/domain/turma-formacao/competencia-colaboradores-nivel-maximo.model';
import { Status } from 'src/app/domain/turma-formacao/status.model';
import { TurmaDto } from 'src/app/domain/turma-formacao/turma-dto.model';
import { Turma } from 'src/app/domain/turma-formacao/turma.model';
import { CompetenciaService } from 'src/app/shared/services/competencia.service';
import { TurmaFormacaoService } from 'src/app/shared/services/turma-formacao.service';
import { StatusService } from '../../../../shared/services/status.service';



@Component({
  selector: 'app-turma-formacao-form',
  templateUrl: './turma-formacao-form.component.html',
  styleUrls: ['./turma-formacao-form.component.css']
})
export class TurmaFormacaoFormComponent implements OnInit, OnDestroy {

  unsubscribeAll = new Subject<void>();
  status: Status[];
  competenciaColaboradorNivelMax: CompetenciaColaboradoresNivelMaximo[];
  turmaForm: FormGroup;
  competenciaColaboradorForm: FormGroup;
  colaboradores: SelectItem[] = [];

  constructor(
    private turmaService: TurmaFormacaoService,
    private statusService: StatusService,
    private competenciaService: CompetenciaService,
    private messageService: PageNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationDialog: ConfirmationService
  ) { }

  ngOnInit() {
    this.listarStatus();
    this.buscarCompetenciasColaboradoresNivelMaximo();
    this.criarTurmaForm();
    this.criarCompetenciaColaboradorForm();
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        params => {
          const param = params.get('param');
          if (param === 'criar') {
            this.turmaForm.setValue({
              id: null,
              nome: null,
              descricao: null,
              dataInicio: null,
              dataTermino: null,
              status: null,
              competenciasColaboradores: []
            });
            this.turmaForm.markAsPristine();
            this.turmaForm.markAsUntouched();
          } else {
            this.turmaService.buscarPeloId(+param).subscribe(
              turma => {
                turma.dataInicio = new Date(turma.dataInicio);
                turma.dataTermino = new Date(turma.dataTermino);
                this.turmaForm.patchValue(turma);
                this.turmaForm.markAsPristine()
                this.turmaForm.markAsUntouched();
              }
            );
          }
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  criarTurmaForm() {
    this.turmaForm = new FormGroup({
      id: new FormControl(),
      nome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      descricao: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      dataInicio: new FormControl(null, [Validators.required]),
      dataTermino: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      competenciasColaboradores: new FormControl(null, [Validators.required])
    });
  }

  criarCompetenciaColaboradorForm() {
    this.competenciaColaboradorForm = new FormGroup({
      competencia: new FormControl(null),
      colaborador: new FormControl(null)
    });
    this.competenciaColaboradorForm.get('competencia')
      .valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((valorSelecionado: CompetenciaColaboradoresNivelMaximo) => {
        if (valorSelecionado && valorSelecionado.colaboradores) {
          this.colaboradores = valorSelecionado.colaboradores.map(c => {
            const item: SelectItem = {
              label: `${c.nome} ${c.sobrenome}`,
              value: c
            }
            return item;
          });
        } else {
          return this.colaboradores = null;
        }
      });
  }

  submitForm() {
    if (!this.turmaForm.get('id').value) {
      this.salvarTurma();
    } else {
      this.atualizarTurma();
    }
  }

  salvarTurma() {
    this.confirmationDialog.confirm({
      header: 'Confirmar Salvamento',
      message: 'Deseja realmente criar essa turma?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const turmaDto = this.turmaToTurmaDto(this.turmaForm.value);
        this.turmaService.salvar(turmaDto).subscribe(
          t => {
            this.turmaForm.markAsPristine();
            this.turmaForm.markAsUntouched();
            this.irParaTurmaList();
            this.messageService.addCreateMsg("Turma de formação criada com sucesso!");
          })
      },
      reject: () => {
        this.confirmationDialog.close();
      }
    });
  }

  atualizarTurma() {
    this.confirmationDialog.confirm({
      header: 'Confirmar Edição',
      message: 'Deseja realmente atualizar essa turma?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const turma: Turma = this.turmaForm.value;
        const turmaDto = this.turmaToTurmaDto(this.turmaForm.value);
        this.turmaService.atualizar(turma.id, turmaDto).subscribe(
          t => {
            this.turmaForm.markAsPristine();
            this.turmaForm.markAsUntouched();
            this.irParaTurmaList();
            this.messageService.addUpdateMsg("Turma de formação atualizada com sucesso!");
          }
        )
      },
      reject: () => {
        this.confirmationDialog.close();
      }
    });
  }

  turmaToTurmaDto(turma: Turma): TurmaDto {
    const turmaDto: TurmaDto = {
      nome: turma.nome,
      descricao: turma.descricao,
      dataInicio: turma.dataInicio,
      dataTermino: turma.dataTermino,
      statusId: turma.status.id,
      competenciasColaboradores: turma.competenciasColaboradores.map(cc => ({
        competenciaId: cc.competencia.id,
        colaboradorId: cc.colaborador.id
      }))
    }
    return turmaDto;
  }

  buscarCompetenciasColaboradoresNivelMaximo() {
    return this.competenciaService.buscarCompetenciasColaboradoresNivelMaximo().subscribe(
      ccNivelMax => {
        this.competenciaColaboradorNivelMax = ccNivelMax
      }, (err: HttpErrorResponse) => {
        this.messageService.addErrorMessage('Não foi possível carregar as competências e colaboradores com nível máximo');
      }
    )
  }

  listarStatus() {
    return this.statusService.listar().subscribe(
      s => {
        this.status = s
      }, (err: HttpErrorResponse) => {
        this.messageService.addErrorMessage('Não foi possível carregar os status');
      }
    );
  }

  irParaTurmaList() {
    if (this.podeVoltarParaTurmaList()) {
      this.router.navigate(['/turmas'], {
        relativeTo: this.route
      });
    } else {
      this.confirmationDialog.confirm({
        header: 'Confirmar Ação',
        message: 'Deseja realmente voltar para listagem de turmas? As informação preenchidas ou modificadas serão perdidas.',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
          this.router.navigate(['/turmas'], {
            relativeTo: this.route
          });
        },
        reject: () => {
          this.confirmationDialog.close();
        }
      })
    }
  }

  podeVoltarParaTurmaList(): boolean {
    return this.turmaForm.pristine;
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

  limparDataTermino() {
    const novaDataInicio: Date = this.turmaForm.get('dataInicio').value;
    const dataTermino: Date = this.turmaForm.get('dataTermino').value;
    if (novaDataInicio.getTime() > dataTermino.getTime()) {
      this.turmaForm.get('dataTermino').setValue(null);
      this.turmaForm.get('dataTermino').markAsTouched();
      this.messageService.addWarnMessage('A data inicio não pode ser posterior a data termino.');
    }
  }

  adicionarCompetenciaColaborador() {
    if (this.competenciaColaboradorForm.get('competencia').value == null || this.competenciaColaboradorForm.get('colaborador').value == null) {
      this.messageService.addErrorMessage("Deve ser informado pelo menos uma competência e um colaborador.", "Falha ao inserir");
    }

    const competenciaColaboradorForm: {
      competencia: CompetenciaColaboradoresNivelMaximo,
      colaborador: ColaboradorResumo
    } = this.competenciaColaboradorForm.value;

    const competenciaColaborador: CompetenciaColaborador = {
      competencia: competenciaColaboradorForm.competencia.competencia,
      colaborador: competenciaColaboradorForm.colaborador
    }

    let competenciasColaboradoresItens: CompetenciaColaborador[] = this.turmaForm.get('competenciasColaboradores').value;

    if (competenciasColaboradoresItens.some(ccItens =>
      ccItens.competencia.id == competenciaColaborador.competencia.id &&
      ccItens.colaborador.id == competenciaColaboradorForm.colaborador.id
    )) {
      this.messageService.addErrorMessage("Este colaborador já está cadastrado para esta competência.", "Falha ao inserir");
      return;
    }

    competenciasColaboradoresItens.push(competenciaColaborador);

    this.turmaForm.get('competenciasColaboradores').setValue(competenciasColaboradoresItens);
    this.competenciaColaboradorForm.setValue({
      competencia: null,
      colaborador: null
    });
    this.turmaForm.markAsDirty();
  }

  excluirItem(indexRow: number) {
    let ccItens: CompetenciaColaborador[] = [...this.turmaForm.get('competenciasColaboradores').value];
    ccItens.splice(indexRow, 1);
    this.turmaForm.get('competenciasColaboradores').setValue(ccItens);
    this.turmaForm.markAsDirty();
  }

}
