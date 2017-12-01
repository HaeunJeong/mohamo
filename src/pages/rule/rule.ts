import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

/**
 * Generated class for the RulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rule',
  templateUrl: 'rule.html',
})
export class RulePage {

  //key_ = "-KzhvA964-mZa-yTnUH3"; //해당 미팅 방 코드
  member_name = [];
  penalty_text = [];
  member_key = "0"
  penalty_score = [];
  setting_late = [];
  penalty_late = [];
  penalty_early_leave = [];
  penalty_absence = [];

  Jebal: string = '';
  userId;
  meetingCode: string;
  userName: string;
  chartOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.meetingCode = this.navParams.get('godata');
    this.userId = firebase.auth().currentUser.uid;
    var temp;
    var member_id = [];
    var m_name = [];
    var name_s = 'asdasfaf';
    var userName1 = this.userName;

    console.log("meetingcode", this.meetingCode)
    //setting 화면 해당 미팅 멤버 확인
    firebase.database().ref('/allMeeting/' + this.meetingCode + '/member').once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        temp = childSnapshot.key; //member userId
        console.log("temp: ", temp);
        member_id.push(temp);
      })
      return member_id;
    }).then(function (res) {
      res.forEach(function (id) {
        firebase.database().ref('/userProfile/' + id + '/name').once('value', function (snapshot) {
          userName1 = snapshot.val();
          console.log("name: ", userName1);
          m_name.push({ name: userName1 });
        });
      })
    })
    this.member_name = m_name;

    /*
      var penalty_score_temp = [];
       
       firebase.database().ref('/allMeeting/' + this.key_+'/penalty_score').once('value').then(function(snapshot){
         snapshot.forEach(function(childSnapshot){
          var p_score = childSnapshot.val();
          console.log("penal_score_check: ",p_score )
           penalty_score_temp.push({score_p: p_score});
         }); 
       });
       
       this.penalty_score = penalty_score_temp;
          */

    /*
  this.chartOptions = {
    chart:{
        type: 'bar'
    },
    title: {
      text: 'member gauge'
    },
    xAxis : {
      categories: ['지각', '조퇴', '결석']
    },
    yAxis : {
      title: {
        text: 'Penalty score'
      }
    },
    series: [{
      name: name_s, 
      
      data: [1, 0, 4]
    },{ 
      name: 'Max',
      data: [10, 10, 10]
    }]
  }
*/

  }

  ionViewDidEnter() {//firebase에서 데이터 불러오기(총벌점, 지각, 지각벌점, 조퇴벌점, 무단결석벌점)
    var penalty_score_temp = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/penalty_score').once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var p_score = childSnapshot.val();
        console.log("penal_score_check: ", p_score)
        penalty_score_temp.push({ score_p: p_score });
      });
    });

    this.penalty_score = penalty_score_temp;

    var late_setting_temp = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/setting_late').once('value').then(function (snap) {
      snap.forEach(function (childSnap) {
        var set_late = childSnap.val();
        console.log("setting_late: ", set_late)
        late_setting_temp.push({ late: set_late });
      });
    });

    this.setting_late = late_setting_temp;

    var late_penalty_temp = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/penalty_late').once('value').then(function (snap2) {
      snap2.forEach(function (childSnap2) {
        var penalty_late1 = childSnap2.val();
        console.log("penalty_late: ", penalty_late1)
        late_penalty_temp.push({ late_p: penalty_late1 });
      });
    });

    this.penalty_late = late_penalty_temp;

    var early_leave_temp = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/penalty_early_leave').once('value').then(function (snap3) {
      snap3.forEach(function (childSnap3) {
        var penalty_early = childSnap3.val();
        console.log("penalty_early_leave: ", penalty_early)
        early_leave_temp.push({ early_p: penalty_early });
      });
    });

    this.penalty_early_leave = early_leave_temp;

    var absence_temp = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/penalty_absence').once('value').then(function (snap4) {
      snap4.forEach(function (childSnap4) {
        var penalty_absence = childSnap4.val();
        console.log("penalty_absence: ", penalty_absence)
        absence_temp.push({ early_a: penalty_absence });
      });
    });

    var temp;
    var penal_ = [];

    firebase.database().ref('/allMeeting/' + this.meetingCode + '/penalty_text').once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        temp = childSnapshot.val(); //penalty text
        console.log("temp: ", temp);
        penal_.push({ text: temp });
      })
    });

    this.penalty_text = penal_;
    //저장한 곳에서 데이터를 가져오는 작업

    //멤버마다 데이터로 현재 벌점 수치 확인하기(아직 진행중)
    this.penalty_absence = absence_temp;

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'member gauge'
      },
      xAxis: {
        categories: ['지각', '조퇴', '결석']
      },
      yAxis: {
        title: {
          text: 'Penalty score'
        }
      },
      series: [{
        name: this.userName,

        data: [1, 0, 4]
      }, {
        name: 'Max',
        data: [10, 10, 10]
      }]
    }
  }

  late_fuction(selectedValue: any) {
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('setting_late').push(selectedValue);
    this.ionViewDidEnter();
  }

  late_penal_fuction(selectedValue: any) {
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_late').push(selectedValue);
    this.ionViewDidEnter();
  }

  early_leave_fuction(selectedValue: any) {
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_early_leave').push(selectedValue);
    this.ionViewDidEnter();
  }

  absence_fuction(selectedValue: any) {
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_absence').push(selectedValue);
    this.ionViewDidEnter();
  }

  penalty_sum(selectedValue: any) {
    console.log('select: ', selectedValue)
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_score').push(selectedValue);
    this.ionViewDidEnter();
  }



  addPenalty(penalty) {

    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_text').push(penalty); //패널티를 새로 만들어 데이터베이스에 저장하는 작업
    this.ionViewDidEnter();
    console.log("penalty:" + penalty);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RulePage');
    this.navParams.get('godata');
    console.log("데이타보여줘제발", this.navParams.get('godata'))
  }

  //규칙 리셋
  resetRuleSetting() {
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('setting_late').remove();
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_score').remove();
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_late').remove();
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_early_leave').remove();
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_absence').remove();
    firebase.database().ref('/allMeeting/' + this.meetingCode).child('penalty_text').remove();
    this.ionViewDidEnter();
  }
}
