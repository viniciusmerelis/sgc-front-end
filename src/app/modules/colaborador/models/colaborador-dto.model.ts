import { CompetenciaDtoId } from "./competencia-dto-id.model";

export interface ColaboradorDto {
    id: number;
    nome: string;
    sobrenome: string;
    cpf: string;
    email: string;
    dataNascimento: Date;
    dataAdmissao: Date;
    senioridadeId: number;
    competencias: CompetenciaDtoId[];
}
