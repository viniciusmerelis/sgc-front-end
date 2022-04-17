import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ColaboradorListComponent} from './components/colaborador-list/colaborador-list.component';


const routes: Routes = [
    { path: '', component: ColaboradorListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColaboradorRoutingModule { }
