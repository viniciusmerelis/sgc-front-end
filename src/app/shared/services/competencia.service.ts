import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Competencia} from 'src/app/domain/competencia/competencia.model';
import {ColaboradorResumo} from "../../domain/turma-formacao/colaborador-resumo.model";


@Injectable({
    providedIn: 'root'
})
export class CompetenciaService {

    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/competencias';
    }

    listar(): Observable<Competencia[]> {
        return this.http.get<Competencia[]>(this.apiUrl);
    }

    buscarPeloId(competenciaId: number): Observable<Competencia> {
        return this.http.get<Competencia>(`${this.apiUrl}/${competenciaId}`);
    }

    salvar(competencia: Competencia): Observable<Competencia> {
        return this.http.post<Competencia>(this.apiUrl, competencia);
    }

    atualizar(competenciaId: number, competencia: Competencia): Observable<Competencia> {
        return this.http.put<Competencia>(this.apiUrl, competencia);
    }

    excluir(competenciaId: number) {
        return this.http.delete(`${this.apiUrl}/${competenciaId}`);
    }

    buscarColaboradoresComNivelMaximoNaCompetencia(competenciaId: number): Observable<ColaboradorResumo[]> {
        return this.http.get<ColaboradorResumo[]>(`${this.apiUrl}/${competenciaId}?colaboradores=nivel-maximo`);
    }
}
