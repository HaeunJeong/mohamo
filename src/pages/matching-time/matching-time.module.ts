import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatchingTimePage } from './matching-time';

@NgModule({
  declarations: [
    MatchingTimePage,
  ],
  imports: [
    IonicPageModule.forChild(MatchingTimePage),
  ],
})
export class MatchingTimePageModule {}
