import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageNotificationService} from '@nuvem/primeng-components';
import {ConfirmationService, SelectItem} from 'primeng';
import {Colaborador} from 'src/app/domain/colaborador/colaborador.model';
import {CompetenciaDoColaborador} from 'src/app/domain/colaborador/competencia-do-colaborador.model';
import {Nivel, NivelUtil} from 'src/app/domain/colaborador/nivel.enum';
import {Senioridade} from 'src/app/domain/colaborador/senioridade.model';
import {Competencia} from 'src/app/domain/competencia/competencia.model';
import {CompetenciaService} from 'src/app/shared/services/competencia.service';
import {SenioridadeService} from 'src/app/shared/services/senioridade.service';
import {ColaboradorService} from '../../../../shared/services/colaborador.service';


@Component({
    selector: 'app-colaborador-form',
    templateUrl: './colaborador-form.component.html',
    styleUrls: ['./colaborador-form.component.css']
})
export class ColaboradorFormComponent implements OnInit {

    senioridades: Senioridade[] = [];
    competencias: Competencia[] = [];
    niveis: SelectItem[];
    nivelToLabel = NivelUtil.getLabel;
    colaboradorForm: FormGroup;
    competenciasForm: FormGroup;
    @Input() displayModal: Boolean = false;
    @Input() colaborador: Colaborador;
    @Output() onSubmit = new EventEmitter<Colaborador>();

    constructor(
        private colaboradorService: ColaboradorService,
        private senioridadeService: SenioridadeService,
        private competenicaService: CompetenciaService,
        private messageService: PageNotificationService,
        private confirmationDialog: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.niveis = NivelUtil.selectItems;
        this.buscarSenioridades();
        this.buscarCompetencias();
        this.criarColaboradorForm();
        this.criarCompetenciasForm();
        this.definirColaboradorForm();
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
        });
    }

    criarCompetenciasForm() {
        this.competenciasForm = new FormGroup({
            competencia: new FormControl(null),
            nivel: new FormControl(null)
        });
    }

    definirColaboradorForm() {
        if (!this.colaborador) {
            this.colaboradorForm.setValue({
                id: null,
                nome: null,
                sobrenome: null,
                cpf: null,
                email: null,
                dataNascimento: null,
                dataAdmissao: null,
                senioridade: null,
                competencias: null
            });
        } else {
            this.colaborador.dataNascimento = new Date(this.colaborador.dataNascimento);
            this.colaborador.dataAdmissao = new Date(this.colaborador.dataAdmissao);
            this.colaboradorForm.setValue(this.colaborador);
        }
    }

    buscarSenioridades() {
        return this.senioridadeService.listar().subscribe(
            senioridade => this.senioridades = senioridade
        );
    }

    buscarCompetencias() {
        return this.competenicaService.listar().subscribe(
            competencia => this.competencias = competencia
        );
    }

    submit(): void {
        const colaborador: Colaborador = this.colaboradorForm.value;
        this.onSubmit.next(colaborador);
    }

    adicionarCompetencias(): void {
        if (this.competenciasForm.get('competencia').value == null || this.competenciasForm.get('nivel').value == null) {
            this.messageService.addErrorMessage('Deve ser selecionda uma competência e seu nivel!');
            return;
        }
        const competenciasForm: {
            competencia: Competencia,
            nivel: Nivel
        } = this.competenciasForm.value;

        const competencias: CompetenciaDoColaborador = {
            id: competenciasForm.competencia.id,
            nome: competenciasForm.competencia.nome,
            nivel: competenciasForm.nivel
        };
        const competenciasItens: CompetenciaDoColaborador[] = this.colaboradorForm.get('competencias').value;

        if (competenciasItens.some(c => c.id === competenciasForm.competencia.id && c.nome === competenciasForm.competencia.nome)) {
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

    excluirItem(indexRow: number): void {
        const competenciaItens: CompetenciaDoColaborador[] = [...this.colaboradorForm.get('competencias').value];
        competenciaItens.splice(indexRow, 1);
        this.colaboradorForm.get('competencias').setValue(competenciaItens);
        if (competenciaItens.length === 0) {
            this.messageService.addErrorMessage('Deve ser inserido ao menos uma competência a esse colaborador!');
            return;
        }
        this.colaboradorForm.markAsDirty();
    }

    // TODO: Colocar esses metodos em um classe Utils
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
