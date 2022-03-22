import { ColaboradorResumo } from "./colaborador-resumo.model";
import { CompetenciaResumo } from "./competencia-resumo.model";

export interface CompetenciaColaboradoresNivelMaximo {
    competencia: CompetenciaResumo;
    colaboradores: ColaboradorResumo[];
}