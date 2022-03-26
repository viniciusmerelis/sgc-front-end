import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, SelectItem } from 'primeng';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Colaborador } from 'src/app/domain/colaborador/colaborador.model';
import { CompetenciaNivel } from 'src/app/domain/colaborador/competencia-nivel.model';
import { Nivel, NivelUtil } from 'src/app/domain/colaborador/nivel.enum';
import { Senioridade } from 'src/app/domain/colaborador/senioridade.model';
import { Competencia } from 'src/app/domain/competencia/competencia.model';
import { CompetenciaService } from 'src/app/shared/services/competencia.service';
import { SenioridadeService } from 'src/app/shared/services/senioridade.service';
import { ColaboradorDto } from '../../../../domain/colaborador/colaborador-dto.model';
import { ColaboradorService } from '../../../../shared/services/colaborador.service';



@Component({
    selector: 'app-colaborador-form',
    templateUrl: './colaborador-form.component.html',
    styleUrls: ['./colaborador-form.component.css']
})
export class ColaboradorFormComponent implements OnInit, OnDestroy {

    unsubscribeAll = new Subject<void>();
    senioridades: Senioridade[] = [];
    competencias: Competencia[] = [];
    colaboradorForm: FormGroup;
    competenciasForm: FormGroup;
    niveis: SelectItem[];
    nivelToLabel = NivelUtil.getLabel;

    constructor(
        private colaboradorService: ColaboradorService,
        private senioridadeService: SenioridadeService,
        private competenicaService: CompetenciaService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: PageNotificationService,
        private confirmationDialog: ConfirmationService
    ) { }

    ngOnInit() {
        this.niveis = NivelUtil.selectItems;
        this.listarSenioridades();
        this.listarCompetencias();
        this.criarColaboradorForm();
        this.criarCompetenciasForm();
        this.definirColaboradorForm();
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    criarColaboradorForm() {
        this.colaboradorForm = new FormGroup({
            id: new FormControl(),
            nome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            sobrenome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            cpf: new FormControl(null, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            email: new FormControl(null, Validators.required),
            dataNascimento: new FormControl(null, Validators.required),
            dataAdmissao: new FormControl(null, Validators.required),
            senioridade: new FormControl(null, Validators.required),
            competencias: new FormControl(null, Validators.required)
        })
    }

    criarCompetenciasForm() {
        this.competenciasForm = new FormGroup({
            competencia: new FormControl(null),
            nivel: new FormControl(null)
        });
    }

    definirColaboradorForm() {
        this.route.paramMap
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(
                params => {
                    const param = params.get('param');
                    if (param === 'criar') {
                        this.colaboradorForm.setValue({
                            id: null,
                            nome: null,
                            sobrenome: null,
                            cpf: null,
                            email: null,
                            dataNascimento: null,
                            dataAdmissao: null,
                            senioridade: null,
                            competencias: []
                        })
                    } else {
                        this.colaboradorService.buscarPeloId(+param).subscribe(
                            colaborador => {
                                colaborador.dataNascimento = new Date(colaborador.dataNascimento);
                                colaborador.dataAdmissao = new Date(colaborador.dataAdmissao);
                                this.colaboradorForm.patchValue(colaborador);
                                this.colaboradorForm.markAsPristine();
                                this.colaboradorForm.markAsUntouched();
                            }
                        )
                    }
                }
            )
    }

    submitForm() {
        if (!this.colaboradorForm.get('id').value) {
            this.salvarColaborador();
        } else {
            this.atualizarColaborador();
        }
    }

    salvarColaborador() {
        this.confirmationDialog.confirm({
            header: 'Confirmar Salvamento',
            message: 'Deseja realmente criar esse colaborador?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                const colaboradorDto = this.colaboradorToColaboradorDto(this.colaboradorForm.value);
                this.colaboradorService.salvar(colaboradorDto).subscribe(
                    c => {
                        this.colaboradorForm.markAsPristine();
                        this.competenciasForm.markAsUntouched();
                        this.irParaColaboradorList();
                        this.messageService.addCreateMsg('Colaborador criado com sucesso!');
                    }, (err: HttpErrorResponse) => {
                        this.messageService.addErrorMessage(err.error.detail, err.error.title);
                    });
            },
            reject: () => {
                this.confirmationDialog.close();
            }
        });
    }

    atualizarColaborador() {
        this.confirmationDialog.confirm({
            header: 'Confirmar Edição',
            message: 'Deseja realmente atualizar esse colaborador?',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                const colaborador: Colaborador = this.colaboradorForm.value;
                const colaboradorDto = this.colaboradorToColaboradorDto(this.colaboradorForm.value);
                this.colaboradorService.atualizar(colaborador.id, colaboradorDto).subscribe(
                    c => {
                        this.colaboradorForm.markAsPristine();
                        this.competenciasForm.markAsUntouched();
                        this.irParaColaboradorList();
                        this.messageService.addUpdateMsg('Colaborador atualizado com sucesso!');
                    }, (err: HttpErrorResponse) => {
                        this.messageService.addErrorMessage(err.error.detail, err.error.title);
                    });
            },
            reject: () => {
                this.confirmationDialog.close();
            }
        });
    }

    colaboradorToColaboradorDto(colaborador: Colaborador) {
        const colaboradorDto: ColaboradorDto = {
            nome: colaborador.nome,
            sobrenome: colaborador.sobrenome,
            cpf: colaborador.cpf,
            email: colaborador.email,
            dataNascimento: colaborador.dataNascimento,
            dataAdmissao: colaborador.dataAdmissao,
            senioridadeId: colaborador.senioridade.id,
            competencias: colaborador.competencias.map(
                c => ({
                    id: c.id,
                    nivel: c.nivel
                })
            )
        }
        return colaboradorDto;
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

    irParaColaboradorList() {
        if (this.podeVoltarParaColaboradorList()) {
            this.router.navigate(['/colaboradores'], {
                relativeTo: this.route
            });
        } else {
            this.confirmationDialog.confirm({
                header: 'Confirmar Ação',
                message: 'Deseja realmente voltar para listagem de colaboradores? As informação preenchidas ou modificadas serão perdidas.',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                accept: () => {
                    this.router.navigate(['/colaboradores'], {
                        relativeTo: this.route
                    });
                },
                reject: () => {
                    this.confirmationDialog.close();
                }
            })
        }
    }

    podeVoltarParaColaboradorList(): boolean {
        return this.colaboradorForm.pristine;
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

    adicionarCompetencias() {
        if (this.competenciasForm.get('competencia').value == null || this.competenciasForm.get('nivel').value == null) {
            this.messageService.addErrorMessage('Deve ser selecionda uma competência e seu nivel!');
            return;
        }
        const competenciasForm: {
            competencia: Competencia,
            nivel: Nivel
        } = this.competenciasForm.value;

        const competencias: CompetenciaNivel = {
            id: competenciasForm.competencia.id,
            nome: competenciasForm.competencia.nome,
            nivel: competenciasForm.nivel
        }
        let competenciasItens: CompetenciaNivel[] = this.colaboradorForm.get('competencias').value;

        if (competenciasItens.some(c => c.id == competenciasForm.competencia.id && c.nome == competenciasForm.competencia.nome)) {
            this.messageService.addErrorMessage('Competência já cadastrada para esse colaborador!');
            return;
        }
        competenciasItens.push(competencias);
        this.colaboradorForm.get('competencias').setValue(competenciasItens);
        this.competenciasForm.setValue({
            competencia: null,
            nivel: null
        });
        this.colaboradorForm.markAsDirty();
    }

    excluirItem(indexRow: number) {
        let competenciaItens: CompetenciaNivel[] = [...this.colaboradorForm.get('competencias').value];
        competenciaItens.splice(indexRow, 1);
        this.colaboradorForm.get('competencias').setValue(competenciaItens);
        if (competenciaItens.length == 0) {
            this.messageService.addErrorMessage('Deve ser inserido ao menos uma competência a esse colaborador!');
            return;
        }
        this.colaboradorForm.markAsDirty();
    }

}
