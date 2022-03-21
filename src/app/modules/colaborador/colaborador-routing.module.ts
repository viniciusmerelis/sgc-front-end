import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColaboradorFormComponent } from './components/colaborador-form/colaborador-form.component';
import { ColaboradorListComponent } from './components/colaborador-list/colaborador-list.component';


const routes: Routes = [
    { path: '', component: ColaboradorListComponent },
    { path: ':param', component: ColaboradorFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
