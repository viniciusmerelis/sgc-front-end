import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Colaborador } from '../../models/colaborador.model';
import { ColaboradorService } from '../../service/colaborador.service';

@Component({
    selector: 'app-colaborador-list',
    templateUrl: './colaborador-list.component.html',
    styleUrls: ['./colaborador-list.component.css']
})
export class ColaboradorListComponent implements OnInit {

    colaboradores: Colaborador[] = [];

    constructor(
        private colaboradorService: ColaboradorService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.listarColaboradores()
    }

    listarColaboradores() {
        return this.colaboradorService.listar().subscribe(
            colaborador => this.colaboradores = colaborador
        );
    }

    excluir(colaborador: Colaborador) {
        return this.colaboradorService.excluir(colaborador.id).subscribe(() => {
            this.colaboradores = this.colaboradores.filter(c => c.id !== colaborador.id)
        });
    }

    editar(colaboradorId: number) {
        this.router.navigate([`${colaboradorId}`], { relativeTo: this.route });
    }

}
