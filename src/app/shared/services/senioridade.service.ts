import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Senioridade } from 'src/app/domain/colaborador/senioridade.model';


@Injectable({
    providedIn: 'root'
})
export class SenioridadeService {

    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/senioridades';
    }

    listar(): Observable<Senioridade[]> {
        return this.http.get<Senioridade[]>(this.apiUrl);
    }
}
