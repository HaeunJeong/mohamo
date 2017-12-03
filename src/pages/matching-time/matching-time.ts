import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingListPage } from '../meeting-list/meeting-list';
import * as firebase from 'firebase';
import { GoogleMapPage } from '../google-map/google-map';
import { IndiPagePage } from '../indiPage/indiPage';

@IonicPage()
@Component({
  selector: 'page-matching-time',
  templateUrl: 'matching-time.html',
})
export class MatchingTimePage {

  //UI는 표로 시간표가 표시되고, true인것만 노란색으로!
  //여기는 이미 meeting_list에서 넘어온 page이므로, meeting code가 있다.

  userId;
  meeting_code;
  times = [];
  m_lat;
  m_lng;
  m_place;
  selected_time =[];
  month = new Date().getMonth() + 1;
  
  haveSchedule = [];
  dayOf11 = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  dayOf12 = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

  schedules_sun = [];
  schedules_mon = [];
  schedules_tue = [];
  schedules_wed = [];
  schedules_thu = [];
  schedules_fri = [];
  schedules_sat = [];
  sun_date;
  mon_date;
  tue_date;
  wed_date;
  thu_date;
  fri_date;
  sat_date;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.meeting_code = navParams.data;

  }

  getThisWeek(date, member_id) { //오늘날짜가 포함된 1주일치의 schedule 내용을 읽어오기
    console.log("what " + date + " called");
    var getThis = this;
   

    var today_month = new Date().getMonth() + 1;
    //today_month = 11;
    var today_date = new Date().getDate(); 
    var today_day = new Date().getDay();
    var last_date = this.getMonthOfLastDate(today_month);
    //console.log("last_date: "+last_date);

    var dayOrderByMonth;
    if (today_month == 11)
      dayOrderByMonth = getThis.dayOf11;
    else if (today_month == 12)
      dayOrderByMonth = getThis.dayOf12;

  

    firebase.database().ref('/userProfile/' + member_id + '/schedule/y_17/m_' + today_month + '/d_' + date + '/' + dayOrderByMonth[(date - 1) % 7])
      .once('value').then(function (snapshot) {
        var now_date = date;
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val() != false && 
              getThis.haveSchedule.indexOf({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: childSnapshot.key, value: 'No'})==-1) { 
                //누군가가 스케쥴이 있으면 && 그 시간대가 haveSchedule array에 들어가있지 않으면,
            getThis.haveSchedule.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: childSnapshot.key, value: 'No'});
            console.log({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: childSnapshot.key, value: 'No'});
          }
        })
      });
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


  ionViewDidLoad() {
    var getThis = this;

    var today_month = new Date().getMonth() + 1;
    //today_month = 11;
    var today_date = new Date().getDate(); 
    var today_day = new Date().getDay();
    //var today_date = 20;
    //var today_day = 1;

    
    var backward = today_day; //0:일, 1:월, 2:화


    var temp:String;
    var member_list=[]; //모임에 속한 member들의 key
    var temp_list =[];

    var dayOrderByMonth;
    if (today_month == 11)
      dayOrderByMonth = getThis.dayOf11;
    else if (today_month == 12)
      dayOrderByMonth = getThis.dayOf12;

   

    //오늘이 포함된 1주일(일요일, 월요일..... 토요일 순서대로)에서 할일이 있는 부분만 가져옴
    //월 넘어가면 날짜 변환 시켜줘야하는데, 그부분은 안함

    firebase.database().ref('/allMeeting/'+this.meeting_code+'/member').once('value')
    .then(function(snapshot){
      //해당 미팅에 속해있는 member들의 list를 저장한다.
      snapshot.forEach(function(childSnapshot){
        temp = childSnapshot.key;
        console.log(temp);
        member_list.push(temp);
      })
      return member_list;
    }).then(function(res){
      res.forEach(function(member_id){

        // 한 일자별로 돌면서, 그 안에 스케쥴이 있으면 그걸 haveSchedule 어레이에 넣는다. 
        // 일주일치를 다 돌면, 그 다음에는 다음 멤버로 돌아가서 다시 반복
      for (var date = today_date - backward; date < 7 + today_date-backward; date++) { //오늘날짜에서 뒤로 며칠이 있는지 계산하여, 그 요일이 포함된 1주일을 가져오도록 함
        // console.log('반복문 ' + date);
        getThis.getThisWeek(date, member_id);
      }

      //끝나면, haveSchedule 에는 모든 멤버의 스케쥴이 있는 시간대가 들어가있음.
    })
  }).then(function(res){

    for (var date = today_date - backward; date < 7 + today_date-backward; date++){

      //console.log(getThis.haveSchedule[1]);
      if(dayOrderByMonth[(date - 1) % 7]=='Sun'){

        getThis.sun_date = date;

        for(var alltime = 1; alltime<=9;alltime++){
          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '00')==-1)
         getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false});
          else getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});

          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '30')==-1)
          getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false});
          else getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {

          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false});
          else getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false});

          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false});
          else getThis.schedules_sun.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false});

        }
        
      }
      if (dayOrderByMonth[(date - 1) % 7] == 'Mon') {

        getThis.mon_date = date;
        

        for (var alltime = 1; alltime <= 9; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '00')==-1)
            getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_mon.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});
          
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '30')==-1)
            getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_mon.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false });
        
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_mon.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false });


        }

      }
      if(dayOrderByMonth[(date - 1) % 7]=='Tue'){

        getThis.tue_date = date;
        
        for(var alltime = 1; alltime<=9;alltime++){
          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '00')==-1)
          getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false});
          else getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});

          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '30')==-1)
          getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false});
          else getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false});
          else getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false});

          if(getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false});
          else getThis.schedules_tue.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false});


        }
        
      }
      if (dayOrderByMonth[(date - 1) % 7] == 'Wed') {

        getThis.wed_date = date;
        
        for (var alltime = 1; alltime <= 9; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' + alltime + ':' + '00')==-1)
            getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_wed.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});
          
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time ==='0' +  alltime + ':' + '30')==-1)
            getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_wed.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false });

        if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_wed.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false });
        }

      }
      if (dayOrderByMonth[(date - 1) % 7] == 'Thu') {

        getThis.thu_date = date;
        

        for (var alltime = 1; alltime <= 9; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '00')==-1)
            getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false });
            else getThis.schedules_thu.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});

          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '30')==-1)
            getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_thu.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false });

        if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false });
        else getThis.schedules_thu.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false });


        }

      }
      if (dayOrderByMonth[(date - 1) % 7] == 'Fri') {

        getThis.fri_date = date;
        
        for (var alltime = 1; alltime <= 9; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '00')==-1)
            getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_fri.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});
          
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '30')==-1)
            getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_fri.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false });

        if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false });
        else getThis.schedules_fri.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false });
        }

      }
      if (dayOrderByMonth[(date - 1) % 7] == 'Sat') {

        getThis.sat_date = date;
        

        for (var alltime = 1; alltime <= 9; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '00')==-1)
            getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: false, isSelected: false });
          else getThis.schedules_sat.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '00', value: true, isSelected: false});
          
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === '0' +alltime + ':' + '30')==-1)
            getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: false, isSelected: false });
          else getThis.schedules_sat.push({date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: '0' + alltime + ':' + '30', value: true, isSelected: false});
        }

        for (var alltime = 10; alltime <= 24; alltime++) {
          if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '00')==-1)
          getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: false, isSelected: false });
          else  getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '00', value: true, isSelected: false});
        if (getThis.haveSchedule.findIndex(i => i.date === 'd_' + date.toString() && i.time === alltime + ':' + '30')==-1)
          getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: false, isSelected: false });
      else getThis.schedules_sat.push({ date: 'd_' + date.toString(), day: dayOrderByMonth[(date - 1) % 7], time: alltime + ':' + '30', value: true, isSelected: false});
        }

      }
    
    }
  }).then(function(res){
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

  });


    
  }

  
  seclectbutton(schedule) {

    var getThis = this;
    var res = schedule.date.split('_'); //일자만 딱 빼내기

    //선택된 시간이, selected_time 에 없는 시간이면, 그 시간을 selected_time에 넣고, 선택되었다는 표시!
    if(getThis.selected_time.findIndex(i => i.date === res[1] && i.time === schedule.time)==-1 && schedule.value == false){
      getThis.selected_time.push({date:res[1], day: schedule.day, time: schedule.time});
      schedule.isSelected = true;


    }
    
    //기존 selected_time 리스트에 있는 시간이 다시 선택된 경우에는, 리스트에서도 빼고, 선택표시도 해제한다.
    else{
      getThis.selected_time.splice(getThis.selected_time.findIndex(i => i.date === res[1] && i.time === schedule.time),1);
      schedule.isSelected = false;

    }

    console.log(getThis.selected_time);
  }



  goGoogleMap(){

    var getThis = this;
    
    var myCallbackFunction = function(place){
      return new Promise((resolve,rej)=>{
        resolve();
        console.log('장소이름'+place[0]);
        console.log('lat'+place[1]);
        console.log('lng'+place[2]);
        getThis.m_lat = place[1];
        getThis.m_lng = place[2];
        getThis.m_place = place[0];
      })
    }
    
      console.log('googlemap'); 
      this.navCtrl.push(GoogleMapPage, {
        callback: myCallbackFunction
      });
      
  }

  addNewMeetingInfo(){

    var getThis = this;
    var temp;
    var member_list = [];

    var time_table = [];
    
    getThis.selected_time.sort(function (a, b) {
      return a.time - b.time;
    });

    var date = getThis.selected_time[0].date;
    var day = getThis.selected_time[0].day;
    var time = [];
    for(var i=0;i<getThis.selected_time.length;i++)
       time.push(getThis.selected_time[i].time);

    //모임에 참여되어있는 멤버들 모두의 스케쥴에 변화를 줘야함.
    console.log(time);
    firebase.database().ref('/allMeeting/'+getThis.meeting_code+'/member').once('value').then(function (snapshot) {
      console.log('/allMeeting/'+getThis.meeting_code+'/member');
      snapshot.forEach(function (childSnapshot) {
        temp = childSnapshot.key;
        member_list.push(temp);
      })
      return member_list;
    }).then(function (res) {
      res.forEach(function (member) {
        for(var i =0; i<getThis.selected_time.length; i++){
          console.log('/userProfile/' + member + '/schedule/y_17/m_' + getThis.month+'/d_'+date+'/'+day+'/'+time[i]);
          firebase.database().ref('/userProfile/' + member + '/schedule/y_17/m_' + getThis.month)
          .child('d_' + date).child(day)
          .child(time[i]).set(true);
        }

      });
    });
 

    for(var alltime = 1;alltime<=9;alltime++){

      time_table.push('0'+alltime+':'+'00');
      time_table.push('0'+alltime+':'+'30');
    }
     
    for(var alltime = 10;alltime<=24;alltime++){
      
      time_table.push(alltime+':'+'00');
      time_table.push(alltime+':'+'30');
    }

    var end_time = time_table.indexOf(getThis.selected_time[getThis.selected_time.length-1].time) + 1;
    var selected_meeting_time = new Date().getMonth() + 1 +'월 '+getThis.selected_time[0].date+'일 '+getThis.selected_time[0].time+
    '-'+time_table[end_time];
    

    var new_time = firebase.database().ref('/allMeeting/'+this.meeting_code).child('infoToMeet').push(true).key;
    firebase.database().ref('/allMeeting/'+this.meeting_code+'/infoToMeet/'+new_time).child('LatLon').child('lat').set(this.m_lat);
    firebase.database().ref('/allMeeting/'+this.meeting_code+'/infoToMeet/'+new_time).child('LatLon').child('lon').set(this.m_lng);
    firebase.database().ref('/allMeeting/'+this.meeting_code+'/infoToMeet/'+new_time).child('dateTime').set(selected_meeting_time);
    firebase.database().ref('/allMeeting/'+this.meeting_code+'/infoToMeet/'+new_time).child('place').set(this.m_place);
    firebase.database().ref('/allMeeting/'+this.meeting_code+'/infoToMeet/'+new_time).child('done').set('n');
    
    alert("정상등록되었습니다.");
    this.navCtrl.pop();
    
  }


}
