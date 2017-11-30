import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypageSchedulePage } from './mypage-schedule';

@NgModule({
  declarations: [
    MypageSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(MypageSchedulePage),
  ],
})
export class MypageSchedulePageModule {}
