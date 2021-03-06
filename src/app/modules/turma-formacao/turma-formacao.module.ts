import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurmaFormacaoRoutingModule } from './turma-formacao-routing.module';
import { TurmaFormacaoListComponent } from './components/turma-formacao-list/turma-formacao-list.component';
import { TurmaFormacaoFormComponent } from './components/turma-formacao-form/turma-formacao-form.component';
import { ConfirmationService } from 'primeng';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TurmaFormacaoListComponent, TurmaFormacaoFormComponent],
  imports: [
    CommonModule,
    TurmaFormacaoRoutingModule,
    SharedModule
  ],
  providers: [ConfirmationService]
})
export class TurmaFormacaoModule { }
