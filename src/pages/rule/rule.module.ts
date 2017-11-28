import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RulePage } from './rule';

@NgModule({
  declarations: [
    RulePage,
  ],
  imports: [
    IonicPageModule.forChild(RulePage),
  ],
})
export class RulePageModule {}
