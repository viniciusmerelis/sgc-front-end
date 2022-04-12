import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colaborador } from 'src/app/domain/colaborador/colaborador.model';


@Injectable({
    providedIn: 'root'
})
export class ColaboradorService {

    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/colaboradores';
    }

    listar(): Observable<Colaborador[]> {
        return this.http.get<Colaborador[]>(this.apiUrl);
    }

    buscarPeloId(colaboradorId: number): Observable<Colaborador> {
        return this.http.get<Colaborador>(`${this.apiUrl}/${colaboradorId}`);
    }

    salvar(colaborador: Colaborador): Observable<Colaborador> {
        return this.http.post<Colaborador>(this.apiUrl, colaborador);
    }

    atualizar(colaboradorId: number, colaborador: Colaborador): Observable<Colaborador> {
        return this.http.put<Colaborador>(`${this.apiUrl}/${colaboradorId}`, colaborador);
    }

    excluir(colaboradorId: number) {
        return this.http.delete(`${this.apiUrl}/${colaboradorId}`);
    }
}
