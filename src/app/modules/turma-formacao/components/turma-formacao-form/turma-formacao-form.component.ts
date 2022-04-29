import {HttpErrorResponse} from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageNotificationService} from '@nuvem/primeng-components';
import {ColaboradorResumo} from 'src/app/domain/turma-formacao/colaborador-resumo.model';
import {CompetenciaEColaborador} from 'src/app/domain/turma-formacao/competencia-colaborador.model';
import {Status} from 'src/app/domain/turma-formacao/status.model';
import {Turma} from 'src/app/domain/turma-formacao/turma.model';
import {CompetenciaService} from 'src/app/shared/services/competencia.service';
import {TurmaFormacaoService} from 'src/app/shared/services/turma-formacao.service';
import {StatusService} from '../../../../shared/services/status.service';
import {CompetenciaResumo} from '../../../../domain/competencia/competencia-resumo.model';


@Component({
    selector: 'app-turma-formacao-form',
    templateUrl: './turma-formacao-form.component.html',
    styleUrls: ['./turma-formacao-form.component.css']
})
export class TurmaFormacaoFormComponent implements OnInit {

    status: Status[];
    competencias: CompetenciaResumo[] = [];
    competenciaSelecionada: CompetenciaResumo;
    colaboradores: ColaboradorResumo[] = [];
    turmaForm: FormGroup;
    competenciaEColaboradorForm: FormGroup;
    @Input() displayModal: Boolean = false;
    @Input() turma: Turma;
    @Output() onSubmit = new EventEmitter<Turma>();

    constructor(
        private turmaService: TurmaFormacaoService,
        private statusService: StatusService,
        private competenciaService: CompetenciaService,
        private messageService: PageNotificationService
    ) {
    }

    ngOnInit() {
        this.buscarStatus();
        this.buscarCompetencias();
        this.criarTurmaForm();
        this.criarCompetenciaColaboradorForm();
        this.definirTurmaForm();
    }

    criarTurmaForm() {
        this.turmaForm = new FormGroup({
            id: new FormControl(),
            nome: new FormControl(null, [Validators.required, Validators.minLength(3)]),
            descricao: new FormControl(null, [Validators.required, Validators.minLength(5)]),
            dataInicio: new FormControl(null, [Validators.required]),
            dataTermino: new FormControl(null, [Validators.required]),
            status: new FormControl(null, [Validators.required]),
            competenciasEColaboradores: new FormControl(null, [Validators.required])
        });
    }

    criarCompetenciaColaboradorForm() {
        this.competenciaEColaboradorForm = new FormGroup({
            competencia: new FormControl(null),
            colaborador: new FormControl(null)
        });
    }

    definirTurmaForm() {
        if (!this.turma) {
            this.turmaForm.setValue({
                id: null,
                nome: null,
                descricao: null,
                dataInicio: null,
                dataTermino: null,
                status: null,
                competenciasEColaboradores: []
            });
        } else {
            this.turma.dataInicio = new Date(this.turma.dataInicio);
            this.turma.dataTermino = new Date(this.turma.dataTermino);
            this.turmaForm.setValue(this.turma);
        }
    }

    buscarStatus() {
        return this.statusService.listar().subscribe(
            s => this.status = s,
            (err: HttpErrorResponse) => {
                this.messageService.addErrorMessage('Não foi possível carregar os status');
            });
    }

    buscarCompetencias() {
        return this.competenciaService.listar().subscribe(
            competencia => this.competencias = competencia,
            (err: HttpErrorResponse) => this.messageService.addErrorMessage(err.error.userMessage, err.error.time));
    }

    buscarColaboradoresComNivelMaximoNaCompetencia(competenciaId: number) {
        this.competenciaService.buscarColaboradoresComNivelMaximoNaCompetencia(competenciaId).subscribe(
            colaborador => {
                this.colaboradores = colaborador;
            }, (err: HttpErrorResponse) => {
                this.messageService.addErrorMessage(err.error.userMessage, err.error.title);
            }
        );
    }

    submit(): void {
        const turma: Turma = this.turmaForm.value;
        this.onSubmit.next(turma);
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

    adicionarCompetenciaEColaborador() {
        if (this.competenciaEColaboradorForm.get('competencia').value == null || this.competenciaEColaboradorForm.get('colaborador').value == null) {
            this.messageService.addErrorMessage('Deve ser informado pelo menos uma competência e um colaborador.', 'Falha ao inserir');
        }

        const competenciaEColaboradorForm: {
            competencia: CompetenciaResumo,
            colaborador: ColaboradorResumo
        } = this.competenciaEColaboradorForm.value;

        let competenciasColaboradoresItens: CompetenciaEColaborador[] = this.turmaForm.get('competenciasEColaboradores').value;

        if (competenciasColaboradoresItens.some(ccItens =>
            ccItens.competencia.id === competenciaEColaboradorForm.competencia.id &&
            ccItens.colaborador.id === competenciaEColaboradorForm.colaborador.id
        )) {
            this.messageService.addErrorMessage('Este colaborador já está cadastrado para esta competência.", "Falha ao inserir');
            return;
        }
        competenciasColaboradoresItens.push(competenciaEColaboradorForm);
        this.turmaForm.get('competenciasEColaboradores').setValue(competenciasColaboradoresItens);
        this.competenciaEColaboradorForm.setValue({
            competencia: null,
            colaborador: null
        });
    }

    excluirItem(indexRow: number) {
        let ccItens: CompetenciaEColaborador[] = [...this.turmaForm.get('competenciasEColaboradores').value];
        ccItens.splice(indexRow, 1);
        this.turmaForm.get('competenciasEColaboradores').setValue(ccItens);
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
