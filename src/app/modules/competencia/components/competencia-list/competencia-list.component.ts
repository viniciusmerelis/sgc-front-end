import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng';
import { Competencia } from '../../models/competencia.model';
import { CompetenciaService } from '../../service/competencia.service';

@Component({
  selector: 'app-competencia-list',
  templateUrl: './competencia-list.component.html',
  styleUrls: ['./competencia-list.component.css']
})
export class CompetenciaListComponent implements OnInit {

  competencias: Competencia[] = [];
  categorias: SelectItem[];

  constructor(
    private competenciaService: CompetenciaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.listarCompetencias();
  }

  listarCompetencias() {
    return this.competenciaService.listar().subscribe(
      competencia => this.competencias = competencia
    );
  }

  excluir(competencia: Competencia) {
    return this.competenciaService.excluir(competencia.id).subscribe(() => {
      this.competencias = this.competencias.filter(c => c.id !== competencia.id)
    });
  }

  navegar(competenciaId: number) {
    this.router.navigate([`${competenciaId}`], { relativeTo: this.route });
  }

}
