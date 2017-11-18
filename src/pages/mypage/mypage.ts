import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

/**
 * Generated class for the MypagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MypagePage {
  key1 = "6go1Z4UWvWdYbjmbenBNm2wbbUv1";  //해당 유저 고유 코드
  person_name = [];
  phone_number = [];
  mail_name = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    //this.userId = firebase.auth().currentUser.uid;
    var temp;
    var p_name = [];
    firebase.database().ref('/userProfile/' + this.key1 + '/name').once('value', function (snapshot) {
      temp = snapshot.val();
      p_name.push({ name: temp });
    })

    this.person_name = p_name;

    var temp1;
    var m_name = [];
    firebase.database().ref('/userProfile/' + this.key1 + '/email').once('value', function (snapshot) {
      temp1 = snapshot.val();
      m_name.push({ mail: temp1 });
    })

    this.mail_name = m_name;


    var temp2;
    var p_number = []

    firebase.database().ref('/userProfile/' + this.key1 + '/phone').once('value', function (snapshot) {
      temp2 = snapshot.val();
      p_number.push({ phone: temp2 });
    })
    this.phone_number = p_number;

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MypagePage');
  }

}
