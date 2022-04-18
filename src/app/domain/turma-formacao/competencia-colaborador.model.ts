import { ColaboradorResumo } from "./colaborador-resumo.model";
import { CompetenciaResumo } from "./competencia-resumo.model";

export interface CompetenciaEColaborador {
    competencia: CompetenciaResumo;
    colaborador: ColaboradorResumo;
}
