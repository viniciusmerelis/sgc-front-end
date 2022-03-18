import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = '/api/categorias';
  }

  buscarCategoriasSelectItem(): Observable<SelectItem[]> {
    return this.http.get<SelectItem[]>(this.apiUrl);
  }
}
