import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TurmaFormacaoListComponent} from './components/turma-formacao-list/turma-formacao-list.component';


const routes: Routes = [
  { path: '', component: TurmaFormacaoListComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurmaFormacaoRoutingModule { }
