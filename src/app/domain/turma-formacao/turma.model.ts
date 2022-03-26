import { CompetenciaColaborador } from "./competencia-colaborador.model";
import { Status } from "./status.model";

export interface Turma {
    id: number;
    nome: string;
    descricao: string;
    dataInicio: string | Date;
    dataTermino: string | Date;
    status: Status;
    competenciasColaboradores: CompetenciaColaborador[];
}