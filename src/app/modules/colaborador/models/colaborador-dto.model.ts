import { Nivel } from "./nivel.model";

export interface ColaboradorDto {
    nome: string;
    sobrenome: string;
    cpf: string;
    email: string;
    dataNascimento: Date;
    dataAdmissao: Date;
    senioridadeId: number;
    competencias: CompetenciaDtoId[];
}

export interface CompetenciaDtoId {
    id: number;
    nivel: Nivel;
}
