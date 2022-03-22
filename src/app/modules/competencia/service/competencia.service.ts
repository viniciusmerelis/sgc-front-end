import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompetenciaColaboradoresNivelMaximo } from '../../turma-formacao/models/competencia-colaboradores-nivel-maximo.model';
import { CompetenciaDto } from '../models/competencia-dto.model';
import { Competencia } from '../models/competencia.model';

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

  salvar(competencia: CompetenciaDto): Observable<Competencia> {
    return this.http.post<Competencia>(this.apiUrl, competencia);
  }

  atualizar(competenciaId: number, competencia: CompetenciaDto): Observable<Competencia> {
    return this.http.put<Competencia>(`${this.apiUrl}/${competenciaId}`, competencia);
  }

  excluir(competenciaId: number) {
    return this.http.delete(`${this.apiUrl}/${competenciaId}`);
  }

  buscarCompetenciasColaboradoresNivelMaximo(): Observable<CompetenciaColaboradoresNivelMaximo[]> {
    return this.http.get<CompetenciaColaboradoresNivelMaximo[]>(`${this.apiUrl}/?colaboradores=nivel-maximo`)
}
}
