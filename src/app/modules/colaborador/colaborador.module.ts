import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColaboradorRoutingModule } from './colaborador-routing.module';
import { ColaboradorFormComponent } from './components/colaborador-form/colaborador-form.component';
import { ColaboradorListComponent } from './components/colaborador-list/colaborador-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmationService } from 'primeng';


@NgModule({
  declarations: [ColaboradorFormComponent, ColaboradorListComponent],
  imports: [
    CommonModule,
    ColaboradorRoutingModule,
    SharedModule
  ],
  providers: [ConfirmationService]
})
export class ColaboradorModule { }
