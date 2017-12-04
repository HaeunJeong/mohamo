import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ShowHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-history',
  templateUrl: 'show-history.html',
})
export class ShowHistoryPage {

  meetingTitle: string;
  meetingCode: string;
  meetingInfo: FirebaseListObservable<any[]>;

   meetInfoIndi = [];
   memName = [];
   memLog = [];
   memTotalPenalty=[];
   logsSet = [];
   showTotalPt =[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, ) {

    this.meetingTitle = navParams.get('meetingTitle');
    this.meetingCode = navParams.get('meetingCode');
    //console.log(this.meetingTitle+ "  "+this.meetingCode);
    this.meetingInfo = af.list('/allMeeting/' + this.meetingCode + '/infoToMeet');

    

    this.meetingInfo.subscribe(meetArray => {

      meetArray.forEach(meetInfo => {
        if (meetInfo.done = 'y') {

          this.af.database.ref('/allMeeting/' + this.meetingCode + '/member').once('value', snapshot1 => {
            snapshot1.forEach(snap1 => {
              //유저별 총 점수
              this.memTotalPenalty.push(snap1.val().personal_penalty);
              //console.log(snap1.val().personal_penalty);
              return false;
            })

            this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + meetInfo.$key + '/attendanceLog').once('value', snapshot => {
              snapshot.forEach(snap => {
                this.af.database.ref('/userProfile/' + snap.key + '/name').once('value', nameGet => {
                  //로그별 유저이름
                  this.memName.push(nameGet.val());
                });
                //로그 추출//
                this.memLog.push(snap.val().attLog);
                return false;
              })
              return false;
            })
              .then(result => {
                for(var i = 0; i < this.memName.length ; i++){
                  this.logsSet.push({name: this.memName[i], memLog: this.memLog[i]});
                  this.showTotalPt.push({name: this.memName[i], totalPt : this.memTotalPenalty[i]});
                }               
              }).then(result=>{
                this.meetInfoIndi.push({ place: meetInfo.place, date: meetInfo.dateTime, logs: this.logsSet});
              }).then(re=>{
                console.log(this.meetInfoIndi);
                console.log(this.showTotalPt);
              });


          });
        }
      })

      
      //af.list('/allMeeting/' + this.meetingCode + '/infoToMeet').once('value', snapshot=>)



    })
  }
}
