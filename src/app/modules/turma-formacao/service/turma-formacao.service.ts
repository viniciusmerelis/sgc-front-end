import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TurmaDto } from '../models/turma-dto.model';
import { Turma } from '../models/turma.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaFormacaoService {

  private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/turmas';
    }

    listar(): Observable<Turma[]> {
        return this.http.get<Turma[]>(this.apiUrl);
    }

    buscarPeloId(turmaId: number): Observable<Turma> {
        return this.http.get<Turma>(`${this.apiUrl}/${turmaId}`);
    }

    save(turmaDto: TurmaDto): Observable<Turma> {
        return this.http.post<Turma>(this.apiUrl, turmaDto);
    }

    update(id: number, turmaDto: TurmaDto): Observable<Turma> {
        return this.http.put<Turma>(`${this.apiUrl}/${id}`, turmaDto);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
