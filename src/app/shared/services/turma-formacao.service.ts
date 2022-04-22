import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Turma} from 'src/app/domain/turma-formacao/turma.model';


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

    salvar(turma: Turma): Observable<Turma> {
        return this.http.post<Turma>(this.apiUrl, turma);
    }

    atualizar(id: number, turma: Turma): Observable<Turma> {
        return this.http.put<Turma>(this.apiUrl, turma);
    }

    excluir(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
