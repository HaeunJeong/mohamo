import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  sun_date;
  mon_date;
  tue_date;
  wed_date;
  thu_date;
  fri_date;
  sat_date;

  month = new Date().getMonth() +1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController) {
      //this.navParams.get('MypageSchedulePage').ionViewDidLoad();
      var getThis = this;
      this.userId = firebase.auth().currentUser.uid;
      this.schedules_sun = this.navParams.get('sun');
      this.schedules_mon = this.navParams.get('mon');
      this.schedules_tue = this.navParams.get('tue');
      this.schedules_wed = this.navParams.get('wed');
      this.schedules_thu = this.navParams.get('thu');
      this.schedules_fri = this.navParams.get('fri');
      this.schedules_sat = this.navParams.get('sat');

    var sun_date_ = getThis.schedules_sun[0].date.split('_');
    var mon_date_ = getThis.schedules_mon[0].date.split('_');
    var tue_date_ = getThis.schedules_tue[0].date.split('_');
    var wed_date_ = getThis.schedules_wed[0].date.split('_');
    var thu_date_ = getThis.schedules_thu[0].date.split('_');
    var fri_date_ = getThis.schedules_fri[0].date.split('_');
    var sat_date_ = getThis.schedules_sat[0].date.split('_');

    getThis.sun_date = sun_date_[1] + '일';
    getThis.mon_date = mon_date_[1] + '일';
    getThis.tue_date = tue_date_[1] + '일';
    getThis.wed_date = wed_date_[1]+ '일';
    getThis.thu_date = thu_date_[1]+ '일';
    getThis.fri_date = fri_date_[1]+ '일';
    getThis.sat_date = sat_date_[1]+ '일';
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SetSchedulePage');
  }



  seclectbutton(schedule) {
    var getThis = this;
    if (schedule.value == false) {
      schedule.value = true;
      firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_'+getThis.month)
        .child(schedule.date).child(schedule.day).child(schedule.time).set(true);
    }
    else //if (schedule.value == true)
    {
      schedule.value = false;
      firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_'+getThis.month)
        .child(schedule.date).child(schedule.day).child(schedule.time).set(false);
    }

    //console.log(schedule.date + " " + schedule.day + " " + schedule.time + " " + schedule.value);
    //getThis.selectedSchedule.push({ date: schedule.date, day: schedule.day, time: schedule.time, value: schedule.value });
    //console.log("selected: "+getThis.selectedSchedule[0].date+" "+getThis.selectedSchedule[0].day+" "+getThis.selectedSchedule[0].time);
  }

  addSchedule() {
    var getThis = this;
    getThis.navCtrl.pop();
    this.navParams.get('MypageSchedulePage').ionViewDidLoad();
  }

}