import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HalTreeComponent } from './hal-tree/hal-tree.component';
import { MatTreeModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatListModule, MatChipsModule, MatMenuModule, MatRadioModule, MatTooltipModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { HalTreeActionDirective } from './hal-tree-action.directive';
import { HalTreeActionDefDirective } from './hal-tree-action-def.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MatListModule,
    MatChipsModule,
    MatMenuModule,
    MatRadioModule,
    MatTooltipModule,
    MatInputModule,
    TranslateModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  declarations: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS,
  providers: [HalTreeActionDefDirective]
})
export class HalTreeModule { }
