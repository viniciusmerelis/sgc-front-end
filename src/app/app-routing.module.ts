import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiarioErrosComponent } from './components/diario-erros/diario-erros.component';
import { LoginSuccessComponent } from '@nuvem/angular-base';
import { CompetenciaModule } from './modules/competencia/competencia.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { TurmaFormacaoModule } from './modules/turma-formacao/turma-formacao.module';

const routes: Routes = [
    { path: 'diario-erros', component: DiarioErrosComponent, data: { breadcrumb: 'Diário de Erros'} },
    { path: 'login-success', component: LoginSuccessComponent },
    { path: 'competencias', loadChildren: () => CompetenciaModule },
    { path: 'colaboradores', loadChildren: () => ColaboradorModule },
    { path: 'turmas', loadChildren: () => TurmaFormacaoModule }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
