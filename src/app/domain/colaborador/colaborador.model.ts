import { CompetenciaDoColaborador } from './competencia-nivel.model';
import { Senioridade } from './senioridade.model';

export interface Colaborador {
    id: number;
    nome: string;
    sobrenome: string;
    cpf: string;
    email: string;
    dataNascimento: Date;
    dataAdmissao: Date;
    senioridade: Senioridade;
    competencias: CompetenciaDoColaborador[];
}
