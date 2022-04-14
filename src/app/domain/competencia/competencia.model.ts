import { Categoria } from './categoria.model';

export interface Competencia {
    id: number;
    nome: string;
    descricao: string;
    categoria: Categoria;
}
