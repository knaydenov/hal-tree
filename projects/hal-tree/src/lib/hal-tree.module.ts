import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HalTreeComponent } from './hal-tree/hal-tree.component';
import { MatTreeModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';
import { HalTreeActionDirective } from './hal-tree-action.directive';
import { HalTreeActionDefDirective } from './hal-tree-action-def.directive';
import { TranslateModule } from '@ngx-translate/core';

const EXPORTED_DECLARATIONS = [
  HalTreeComponent,
  HalTreeActionDirective,
  HalTreeActionDefDirective,
];

@NgModule({
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  declarations: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS,
  providers: [HalTreeActionDefDirective]
})
export class HalTreeModule { }
