import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

/**
 * Generated class for the MemberinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-memberinfo',
  templateUrl: 'memberinfo.html',
})
export class MemberinfoPage {
  userId;
  //key1 = "6go1Z4UWvWdYbjmbenBNm2wbbUv1";  //해당 유저 고유 코드
  person_name = [];
  phone_number = [];
  mail_name = [];
  exampledata;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var temp;
    var p_name = [];
    this.userId = this.navParams.get('gogodata');
    firebase.database().ref('/userProfile/' + this.userId + '/name').once('value', function (snapshot) {
      temp = snapshot.val();
      p_name.push({ name: temp });
    })

    this.person_name = p_name;

    var temp1;
    var m_name = [];
    firebase.database().ref('/userProfile/' + this.userId + '/email').once('value', function (snapshot) {
      temp1 = snapshot.val();
      m_name.push({ mail: temp1 });
    })

    this.mail_name = m_name;



    var p_number = [];
    var p_number2=[];//요기 내생각에는 snapshot써서 한바퀴 돌아야 되가주고 배열만들어서 해야되는거아님?
    var temp4;
    firebase.database().ref('/userProfile/' + this.userId + '/phone_number').once('value', function (snapshot) {
      var temp2 = snapshot.val();
      var temp3 = snapshot.val();
      temp4 = snapshot.val();
      console.log('check:', temp4);
      p_number.push({ phone: temp2 });
      p_number2.push({ phone2: temp3 });
      console.log('phone2: ', temp3);
    })
    this.phone_number = p_number;
    this.exampledata = p_number2;
    this.exampledata = temp4;
    console.log("보여줭:", this.exampledata);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberinfoPage');
  }

}