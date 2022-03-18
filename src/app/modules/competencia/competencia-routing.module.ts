import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompetenciaListComponent } from './components/competencia-list/competencia-list.component';


const routes: Routes = [
  { path: '', component: CompetenciaListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetenciaRoutingModule { }
