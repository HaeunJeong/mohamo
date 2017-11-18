import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { SettingPage } from '../setting/setting';
import { MypagePage } from '../mypage/mypage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  arrData = []
  myInput

  constructor(public navCtrl: NavController, private fdb: AngularFireDatabase) {
    this.fdb.list("/myItems/").subscribe(_data => {
      this.arrData = _data;

      console.log(this.arrData);
    });
  }

  btnAddClicked()
  {
    this.fdb.list("/myItems/").push(this.myInput);
  }

  setplace()
  {
    this.navCtrl.push(SettingPage, {}, {animate: false});
  }

  Mypage()
  {
    this.navCtrl.push(MypagePage, {}, {animate: false});
  }
}
