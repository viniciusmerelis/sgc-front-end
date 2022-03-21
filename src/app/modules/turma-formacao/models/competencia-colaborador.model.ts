import { ColaboradorResumo } from "./colaborador-resumo.model";
import { CompetenciaResumo } from "./competencia-resumo.model";

export interface CompetenciaColaborador {
    competencia: CompetenciaResumo;
    colaborador: ColaboradorResumo;
}