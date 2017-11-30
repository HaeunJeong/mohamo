import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { MypageSchedulePage } from '../mypage-schedule/mypage-schedule';

@IonicPage()
@Component({
  selector: 'page-set-schedule',
  templateUrl: 'set-schedule.html',
})
export class SetSchedulePage {
  loader: LoadingController;

  schedules_sun = [];
  schedules_mon = [];
  schedules_tue = [];
  schedules_wed = [];
  schedules_thu = [];
  schedules_fri = [];
  schedules_sat = [];
  userId;
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
     
    loader.present();

    setTimeout(function () {
      getThis.navCtrl.push(MypageSchedulePage);
    }, 5000);



  }

}