import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

<<<<<<< HEAD
=======
import { AngularFireDatabase } from 'angularfire2/database';
import { SettingPage } from '../setting/setting';
import { MypagePage } from '../mypage/mypage';

>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

<<<<<<< HEAD
  constructor(public navCtrl: NavController) {

  }

=======
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
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
}
