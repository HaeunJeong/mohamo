import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MypagePage } from '../mypage/mypage';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@IonicPage()
@Component({
  selector: 'page-set-schedule',
  templateUrl: 'set-schedule.html',
})
export class SetSchedulePage {

  loader: LoadingController;
  userId;
  schedules_sun = [];
  schedules_mon = [];
  schedules_tue = [];
  schedules_wed = [];
  schedules_thu = [];
  schedules_fri = [];
  schedules_sat = [];
  selectedSchedule = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController) {
    this.userId = firebase.auth().currentUser.uid;
    this.schedules_sun = this.navParams.get('sun');
    this.schedules_mon = this.navParams.get('mon');
    this.schedules_tue = this.navParams.get('tue');
    this.schedules_wed = this.navParams.get('wed');
    this.schedules_thu = this.navParams.get('thu');
    this.schedules_fri = this.navParams.get('fri');
    this.schedules_sat = this.navParams.get('sat');
    // console.log("Sun"+ this.schedules_sun);
    //console.log("Mon"+ this.schedules_mon);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SetSchedulePage');
  }


  seclectbutton(schedule) {
    var getThis = this;
    if (schedule.value == false) {
      schedule.value = true;
      firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_11')
        .child(schedule.date).child(schedule.day).child(schedule.time).set(true);
    }
    else //if (schedule.value == true)
    {
      schedule.value = false;
      firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_11')
        .child(schedule.date).child(schedule.day).child(schedule.time).set(false);
    }

    //console.log(schedule.date + " " + schedule.day + " " + schedule.time + " " + schedule.value);
    //getThis.selectedSchedule.push({ date: schedule.date, day: schedule.day, time: schedule.time, value: schedule.value });
    //console.log("selected: "+getThis.selectedSchedule[0].date+" "+getThis.selectedSchedule[0].day+" "+getThis.selectedSchedule[0].time);
  }

  addSchedule() {
    var getThis = this;
    let loader = getThis.loadingCtrl.create({
      content: "저장중...",
      duration: 5000
    });
    console.log("함수 들어옴 " + getThis.selectedSchedule);
    // 
    /*  for (var i = 0; i < getThis.selectedSchedule.length; i++) {
        console.log(i+"넣는 중")
        firebase.database().ref('/userProfile/' +getThis.userId + '/schedules/y_17/m_11')
        .child(getThis.selectedSchedule[i].date).child(getThis.selectedSchedule[i].day)
        .child(getThis.selectedSchedule[i].time).set(true);
      }
      */
  
    loader.present();
    setTimeout(function () {
      getThis.navCtrl.push(MypagePage);
    }, 5000);
  }

}

    /*
    let m;
    //console.log("length: " + this.schedules.length);
    for (var i = 0; i < this.schedules_sun.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_sun[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        //console.log(this.schedules_sun[i].month);
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Sun').child(this.schedules_sun[i].time).set(true);
      }
    }//for 끝

    for (var i = 0; i < this.schedules_mon.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_mon[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Mon').child(this.schedules_mon[i].time).set(true);
      }
    }

    for (var i = 0; i < this.schedules_tue.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_tue[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Tue').child(this.schedules_tue[i].time).set(true);
      }
    }

    for (var i = 0; i < this.schedules_wed.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_wed[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Wed').child(this.schedules_wed[i].time).set(true);
      }
    }

    for (var i = 0; i < this.schedules_thu.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_thu[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Thu').child(this.schedules_thu[i].time).set(true);
      }
    }

    for (var i = 0; i < this.schedules_fri.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_fri[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Fri').child(this.schedules_fri[i].time).set(true);
      }
    }

    for (var i = 0; i < this.schedules_sat.length; i++) {
      console.log("for문 들어옴");
      m = this.schedules_sat[i].value;
      //색칠된 버튼이면(value값이 true) firebase에 넣기
      if (m == true) {
        firebase.database().ref('/userProfile/' + userInfo + '/schedules/y_17/m_11/Sat').child(this.schedules_sat[i].time).set(true);
      }
    }
*/

