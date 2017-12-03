import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { MypagePage } from '../mypage/mypage';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { SetSchedulePage } from '../set-schedule/set-schedule';
import { MypageSchedulePage } from '../mypage-schedule/mypage-schedule';

@IonicPage()
@Component({
  selector: 'page-set-todo',
  templateUrl: 'set-todo.html',
})
export class SetTodoPage {
  loader: LoadingController;
  userId;
  schedules_sun = [];
  schedules_mon = [];
  schedules_tue = [];
  schedules_wed = [];
  schedules_thu = [];
  schedules_fri = [];
  schedules_sat = [];

  dayOf11 = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  dayOf12 = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

  sun_date;
  mon_date;
  tue_date;
  wed_date;
  thu_date;
  fri_date;
  sat_date;

  month = new Date().getMonth() +1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public events: Events) {

      this.navParams.get('MypageSchedulePage').ionViewDidLoad();
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
  
  seclectbutton(schedule) { //상세일정 버튼 하나에 한개만 입력할 수 있넴...ㅠ
    var getThis = this;
    if (schedule.value != false) {
      let newTodo: string = prompt("상세일정을 입력해주세요");
      if (newTodo != "") {
        firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_'+getThis.month)
          .child(schedule.date).child(schedule.day).child(schedule.time).set(newTodo);

          getThis.ionViewDidLoad();
      }
    }

  }

  
  addSchedule() {
    var getThis = this;
    this.events.publish('reload');
    getThis.navCtrl.pop();
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

  getThisWeek(date) { //오늘날짜가 포함된 1주일치의 schedule 내용을 읽어오기
    console.log("what " + date + " called");
    var getThis = this;
    var this_week = [];

    var today_month = new Date().getMonth() + 1;
    //today_month = 11;
    var today_date = new Date().getDate(); 
    var today_day = new Date().getDay();
    //var today_date = 20;
    //var today_day = 1;
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

      console.log(today_month);
    firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_' + today_month + '/d_' + date + '/' + dayOrderByMonth[(date - 1) % 7])
      .once('value').then(function (snapshot) {
        var now_date = date;
        console.log(date);
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
        else if (this_week[0].day == "Sun"){
          
          getThis.schedules_sun = this_week;
          var sun_date_ = getThis.schedules_sun[0].date.split('_');
          getThis.sun_date = sun_date_[1] + '일';
        }
          
        else if (this_week[0].day == "Mon"){
          getThis.schedules_mon = this_week;
          var mon_date_ = getThis.schedules_mon[0].date.split('_');
          getThis.mon_date = mon_date_[1] + '일';
        }
         
        else if (this_week[0].day == "Tue"){
          getThis.schedules_tue = this_week;
          var tue_date_ = getThis.schedules_tue[0].date.split('_');
          getThis.tue_date = tue_date_[1] + '일';
        }
          
        else if (this_week[0].day == "Wed"){
          getThis.schedules_wed = this_week;
          var wed_date_ = getThis.schedules_wed[0].date.split('_');
          getThis.wed_date = wed_date_[1]+ '일';

        }
          
        else if (this_week[0].day == "Thu"){
          getThis.schedules_thu = this_week;
          var thu_date_ = getThis.schedules_thu[0].date.split('_');
          getThis.thu_date = thu_date_[1]+ '일';

        }
       
        else if (this_week[0].day == "Fri"){
          getThis.schedules_fri = this_week;
        var fri_date_ = getThis.schedules_fri[0].date.split('_');
        getThis.fri_date = fri_date_[1]+ '일';

        }
        
        else if (this_week[0].day == "Sat"){
          getThis.schedules_sat = this_week;
          var sat_date_ = getThis.schedules_sat[0].date.split('_');
    getThis.sat_date = sat_date_[1]+ '일';
        }
       
       // getThis.date.push({date: this_week[0].date, day:this_week[0].day});
      });
  }

  ionViewDidLoad() {
    var getThis = this;
    //오늘날짜가 포함된 1주일치의 schedule 내용을 읽어오기

    var today_month = new Date().getMonth() + 1;
    var today_date = new Date().getDate(); 
    var today_day = new Date().getDay();

    //1주일치를 가져오기 위해서 
    var backward = today_day; //0:일, 1:월, 2:화

    for (var date = today_date - backward; date < 7 + today_date-backward; date++) { //오늘날짜에서 뒤로 며칠이 있는지 계산하여, 그 요일이 포함된 1주일을 가져오도록 함
      // console.log('반복문 ' + date);
      this.getThisWeek(date);
    }

  }


}
