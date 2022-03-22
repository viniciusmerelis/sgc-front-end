import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = '/api/status';
    }

    listar(): Observable<Status[]> {
        return this.http.get<Status[]>(this.apiUrl);
    }
}
