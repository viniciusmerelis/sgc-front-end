import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompetenciaRoutingModule } from './competencia-routing.module';
import { CompetenciaFormComponent } from './components/competencia-form/competencia-form.component';
import { CompetenciaListComponent } from './components/competencia-list/competencia-list.component';


@NgModule({
  declarations: [CompetenciaFormComponent, CompetenciaListComponent],
  imports: [
    CommonModule,
    CompetenciaRoutingModule
  ]
})
export class CompetenciaModule { }
