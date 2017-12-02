import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding  } from 'ionic-angular';
import * as firebase from 'firebase';
import { MatchingTimePage } from '../matching-time/matching-time';
import { IndiPagePage } from '../indiPage/indiPage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MypageSchedulePage } from '../mypage-schedule/mypage-schedule';

@IonicPage()
@Component({
  selector: 'page-meeting-list',
  templateUrl: 'meeting-list.html',
})
export class MeetingListPage {

  userId;
  title_list: Array<Meeting_Simple> = [];
  //title_list:FirebaseListObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl:AlertController) {
    this.userId = firebase.auth().currentUser.uid;
  }
 
  ionViewDidEnter(){

    var temp;
    var meeting_list=[];
    var mock_list =[];

      firebase.database().ref('/userProfile/' + this.userId + '/m_list').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot){
                temp = childSnapshot.key;
                meeting_list.push(temp);
        })
        return meeting_list;
    }).then(function(res){
      res.forEach(function(key_){
        var code_ = key_;
        firebase.database().ref('/allMeeting/'+key_+'/title').once('value', function(snapshot){
          var title_:string = snapshot.val();
          console.log('title: '+title_);
          mock_list.push({title: title_, code:code_});
      });
    },this);
  });

  this.title_list = mock_list;

  }

  makeNewMeeting() {

    let newMeetingKey, meeting_title: string;

    meeting_title = prompt("Meeting Title");

    //null일때는 key가 안들어가도록 수정해야함
    
    if (meeting_title != '' || meeting_title != null) {

      newMeetingKey =  firebase.database().ref('/userProfile/'+this.userId).child('m_list').push(true).key;
      console.log(newMeetingKey);

      firebase.database().ref('/allMeeting/'+newMeetingKey).child('member').child(this.userId).set(true);
      firebase.database().ref('/allMeeting/'+newMeetingKey).child('title').set(meeting_title);

      this.ionViewDidEnter();
      
    }
    //return firebase.database().ref().update(updates);

  }

  enterMeeting(code){

    let error_nodata;
    let alert = this.alertCtrl;
    let id = this.userId;
    //let refresh = this.ionViewDidEnter;

    firebase.database().ref('/allMeeting/').once('value').then(function(snapshot){
      if(snapshot.hasChild(code)){
        console.log("data exist");
        firebase.database().ref('/allMeeting/'+code+'/member').child(id).set(true);
        firebase.database().ref('/userProfile/'+id+'/m_list').child(code).set(true);
        
      }
      else{
        error_nodata = alert.create({
          message: "해당하는 코드의 모임방이 없습니다.",
           buttons: [{ text: "Ok", role: 'cancel'}]
         });
         error_nodata.present();
      }
    });

    this.ionViewDidEnter();

  }

  removeMeeting(temp){
    console.log('remove');
;
    let alert = this.alertCtrl
    let wantRemove = alert.create({
      title: '모임방 삭제',
      message: "해당 모임방에서 나가시겠습니까?",
      buttons: [
        {
          text:'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        { text: "Ok", 
          handler: data => {
            console.log("remove:", temp.title);
            firebase.database().ref('/allMeeting/'+temp.code+'/member').child(this.userId).remove();
            firebase.database().ref('/userProfile/'+this.userId+'/m_list').child(temp.code).remove();
            this.ionViewDidEnter();
        }
      }
      
      ]
    });


    wantRemove.present();
  }

  ionViewDidLoad() {

     //처음 미팅리스트페이지에 들어오면 스케쥴 부분 디비 자동생성
    var dayOf11 = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
    var dayOf12 = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
   
    

    var month = new Date().getMonth() + 1;
    var monthOrder = [];
    if(month==12)
      monthOrder = dayOf12;
    
    var getThis = this;
    getThis.userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/userProfile/' + getThis.userId + '/schedule').once('value', function (snapshot) {

      if (snapshot.val() == null) {
        console.log('생성댐'); //회원가입할때 넣기!

        // for (var date = 1; date <= 30; date++) {
        //   for (var alltime = 1; alltime <= 9; alltime++) {
        //     firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
        //       .child('y_17').child('m_11').child('d_' + date.toString())
        //       .child(dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '00').set(false);
        //     firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
        //       .child('y_17').child('m_11').child('d_' + date.toString())
        //       .child(dayOf11[(date - 1) % 7]).child('0' + alltime + ':' + '30').set(false);
        //   }
        //   for (var alltime = 10; alltime <= 24; alltime++) {
        //     firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
        //       .child('y_17').child('m_11').child('d_' + date.toString())
        //       .child(dayOf11[(date - 1) % 7]).child(alltime + ':' + '00').set(false);
        //     firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
        //       .child('y_17').child('m_11').child('d_' + date.toString())
        //       .child(dayOf11[(date - 1) % 7]).child(alltime + ':' + '30').set(false);
        //     //getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '00', value: false });

        //     // getThis.m_11.push({ date: 'd_' + date.toString(), day: getThis.dayOf11[(date - 1) % 7], time: alltime + ':' + '30', value: false });
        //   }
        // }
        for (var date = 1; date <= 31; date++) {
          for (var alltime = 1; alltime <= 9; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_'+month).child('d_' + date.toString())
              .child(monthOrder[(date - 1) % 7]).child('0' + alltime + ':' + '00').set(true);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_'+month).child('d_' + date.toString())
              .child(monthOrder[(date - 1) % 7]).child('0' + alltime + ':' + '30').set(true);
          }
          for (var alltime = 10; alltime <= 24; alltime++) {
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_'+month).child('d_' + date.toString())
              .child(monthOrder[(date - 1) % 7]).child(alltime + ':' + '00').set(false);
            firebase.database().ref('/userProfile/' + getThis.userId + '/schedule')
              .child('y_17').child('m_'+month).child('d_' + date.toString())
              .child(monthOrder[(date - 1) % 7]).child(alltime + ':' + '30').set(false);
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

  goMeetingPage(Meeting_Simple){
    this.navCtrl.push(IndiPagePage, Meeting_Simple.code);
  }

  goHome()
  {
    this.navCtrl.push(MypageSchedulePage);
  }

}

export class Meeting_Simple{
  title:string; code:string;
}
