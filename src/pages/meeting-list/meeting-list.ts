import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ItemSliding  } from 'ionic-angular';
import * as firebase from 'firebase';
import { MatchingTimePage } from '../matching-time/matching-time';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IndiPagePage } from '../indiPage/indiPage';

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

  //저거 들어가는게 실패했을 경우는 어떻게 판별하지???
  //입력끝나면 지워지도록!!


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
    console.log('ionViewDidLoad MeetingListPage');
  }

  goMeetingPage(Meeting_Simple){
    this.navCtrl.push(IndiPagePage, Meeting_Simple.code);
  }

}

export class Meeting_Simple{
  title:string; code:string;
}