import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurmaFormacaoFormComponent } from './components/turma-formacao-form/turma-formacao-form.component';
import { TurmaFormacaoListComponent } from './components/turma-formacao-list/turma-formacao-list.component';


const routes: Routes = [
  { path: '', component: TurmaFormacaoListComponent, pathMatch: 'full' },
  { path: ':param', component: TurmaFormacaoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurmaFormacaoRoutingModule { }
