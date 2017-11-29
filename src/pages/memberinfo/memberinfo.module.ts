import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberinfoPage } from './memberinfo';

@NgModule({
  declarations: [
    MemberinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberinfoPage),
  ],
})
export class MemberinfoPageModule {}
