import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColaboradorDto } from '../models/colaborador-dto.model';
import { Colaborador } from '../models/colaborador.model';

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

    salvar(colaborador: ColaboradorDto): Observable<ColaboradorDto> {
        return this.http.post<ColaboradorDto>(this.apiUrl, colaborador);
    }

    atualizar(colaboradorId: number, colaborador: ColaboradorDto): Observable<ColaboradorDto> {
        return this.http.put<ColaboradorDto>(`${this.apiUrl}/${colaboradorId}`, colaborador);
    }

    excluir(colaboradorId: number) {
        return this.http.delete(`${this.apiUrl}/${colaboradorId}`);
    }
}
