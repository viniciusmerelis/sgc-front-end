import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompetenciaRoutingModule } from './competencia-routing.module';
import { CompetenciaFormComponent } from './components/competencia-form/competencia-form.component';
import { CompetenciaListComponent } from './components/competencia-list/competencia-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CompetenciaFormComponent, CompetenciaListComponent],
  imports: [
    CommonModule,
    CompetenciaRoutingModule,
    SharedModule
  ]
})
export class CompetenciaModule { }
