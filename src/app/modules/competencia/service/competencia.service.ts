import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompetenciaDtoInput } from '../models/competencia-dto.model';
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

  salvar(competencia: CompetenciaDtoInput): Observable<CompetenciaDtoInput> {
    return this.http.post<CompetenciaDtoInput>(this.apiUrl, competencia);
  }

  atualizar(competenciaId: number, competencia: CompetenciaDtoInput): Observable<CompetenciaDtoInput> {
    return this.http.put<CompetenciaDtoInput>(`${this.apiUrl}/${competenciaId}`, competencia);
  }

  excluir(competenciaId: number) {
    return this.http.delete(`${this.apiUrl}/${competenciaId}`);
  }
}
