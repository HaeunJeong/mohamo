import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { SetSchedulePage } from '../set-schedule/set-schedule';
import { SetTodoPage } from '../set-todo/set-todo';


@IonicPage()
@Component({
  selector: 'page-mypage-schedule',
  templateUrl: 'mypage-schedule.html',
})
export class MypageSchedulePage {

  userId;
  dayOf11 = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  dayOf12 = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  schedules_sun = [];
  schedules_mon = [];
  schedules_tue = [];
  schedules_wed = [];
  schedules_thu = [];
  schedules_fri = [];
  schedules_sat = [];
  //date = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId = firebase.auth().currentUser.uid;
    var getThis = this;
    firebase.database().ref('/userProfile/' + this.userId + '/schedule').once('value', function (snapshot) {

      if (snapshot.val() == null) {
        console.log('생성댐'); //회원가입할때 넣기!

        for (var date = 1; date <= 30; date++) {
          for (var alltime = 1; alltime <= 9; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_11').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '00').set(false);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_11').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '30').set(false);
          }
          for (var alltime = 10; alltime <= 24; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_11').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child(alltime + ':' + '00').set(false);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_11').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child(alltime + ':' + '30').set(false);
            //getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '00', value: false });

            // getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '30', value: false });
          }
        }
        for (var date = 1; date <= 31; date++) {
          for (var alltime = 1; alltime <= 9; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_12').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '00').set(false);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_12').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '30').set(false);
          }
          for (var alltime = 10; alltime <= 24; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_12').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child(alltime + ':' + '00').set(false);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_12').child('d_' + date.toString())
              .child(getThis.dayOf11[(date - 1) % 7]).child(alltime + ':' + '30').set(false);
            //getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '00', value: false });

            // getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '30', value: false });
          }
        }
      }
      else {
        console.log('생성안댐');
        // firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_11/d_22/Wed').child('12:' + '00').set("할일있다");
        //firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_11/d_20/Mon').child('15:' + '30').set("할일있다");
      }
    });
  }

  getThisWeek(date) { //오늘날짜가 포함된 1주일치의 schedule 내용을 읽어오기
    console.log("what " + date + " called");
    var getThis = this;
    var this_week = [];

    var today_month = new Date().getMonth() + 1;
    today_month = 11;
    // var today_date = new Date().getDate(); 
    // var today_day = new Date().getDay();
    var today_date = 20;
    var today_day = 1;
    var last_date = this.getMonthOfLastDate(today_month);
    //console.log("last_date: "+last_date);

    //1주일치를 가져오기 위해서 
    var backward = today_day; //0:일, 1:월, 2:화
    //console.log("today_day: " + today_day);

    //각 월마다 요일순서가 다르니까
    var dayOrderByMonth;
    if (today_month == 11)
      dayOrderByMonth = getThis.dayOf11;
    else if (today_month == 12)
      dayOrderByMonth = getThis.dayOf12;

    firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_' + today_month + '/d_' + date + '/' + dayOrderByMonth[(date - 1) % 7])
      .once('value').then(function (snapshot) {
        var now_date = date;
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val() != false) {
            console.log("초록이");
            console.log('date: ' + now_date);
            console.log('day: ' + snapshot.key);
            console.log('time: ' + childSnapshot.key);
            console.log('todo: ' + childSnapshot.val());
            this_week.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: childSnapshot.key, value: childSnapshot.val() });
          }
          else
            this_week.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: childSnapshot.key, value: false });
        })
        return this_week
      }).then(function (res) {
        //console.log("this_week: " + this_week[0].day);
        if (this_week.length == 0)
          console.log("this week 0"); //회원가입할때 미리 scheduleDB도 넣어놓기
        else if (this_week[0].day == "Sun")
          getThis.schedules_sun = this_week;
        else if (this_week[0].day == "Mon")
          getThis.schedules_mon = this_week;
        else if (this_week[0].day == "Tue")
          getThis.schedules_tue = this_week;
        else if (this_week[0].day == "Wed")
          getThis.schedules_wed = this_week;
        else if (this_week[0].day == "Thu")
          getThis.schedules_thu = this_week;
        else if (this_week[0].day == "Fri")
          getThis.schedules_fri = this_week;
        else if (this_week[0].day == "Sat")
          getThis.schedules_sat = this_week;
       // getThis.date.push({date: this_week[0].date, day:this_week[0].day});
      })
  }

  ionViewDidLoad() {
    var getThis = this;
    //오늘날짜가 포함된 1주일치의 schedule 내용을 읽어오기

    var today_month = new Date().getMonth() + 1;
    today_month = 11;
    // var today_date = new Date().getDate(); 
    // var today_day = new Date().getDay();
    var today_date = 20;
    var today_day = 1;
    //console.log("last_date: "+last_date);

    //1주일치를 가져오기 위해서 
    var backward = today_day; //0:일, 1:월, 2:화

    //오늘이 포함된 1주일(일요일, 월요일..... 토요일 순서대로)에서 할일이 있는 부분만 가져옴
    //월 넘어가면 날짜 변환 시켜줘야하는데, 그부분은 안함
    for (var date = today_date - backward; date < 6 + today_date; date++) { //오늘날짜에서 뒤로 며칠이 있는지 계산하여, 그 요일이 포함된 1주일을 가져오도록 함
      // console.log('반복문 ' + date);
      this.getThisWeek(date);
    }
  }

  getMonthOfLastDate(month) {
    if (month == 2) { //2월이면
      var today_year = new Date().getFullYear();
      if (((today_year % 4 == 0) && (today_year % 100 != 0)) || (today_year % 400 == 0))
        return 29;
      else
        return 28;
    }
    else if ((month == 4) || (month == 6) || (month == 9) || (month == 11))
      return 30;
    else
      return 31;
  }


  setSchedule() {
    console.log("페이지 이동");
    this.navCtrl.push(SetSchedulePage, {
      sun: this.schedules_sun,
      mon: this.schedules_mon,
      tue: this.schedules_tue,
      wed: this.schedules_wed,
      thu: this.schedules_thu,
      fri: this.schedules_fri,
      sat: this.schedules_sat
    });
  }

  setTodo() {
    console.log("페이지 이동");
    this.navCtrl.push(SetTodoPage, {
      sun: this.schedules_sun,
      mon: this.schedules_mon,
      tue: this.schedules_tue,
      wed: this.schedules_wed,
      thu: this.schedules_thu,
      fri: this.schedules_fri,
      sat: this.schedules_sat
    });
  }


  seclectbutton(schedule) { }
}
