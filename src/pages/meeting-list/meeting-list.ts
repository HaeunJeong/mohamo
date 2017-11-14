import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-meeting-list',
  templateUrl: 'meeting-list.html',
})
export class MeetingListPage {

  userId;
  title_list: Array<any> = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId = firebase.auth().currentUser.uid;
  }
 
  ionViewDidEnter(){

    //title_list를 public 으로 빼는 순간, push가 되지 않는다!
    var temp;
    var meeting_list=[];
    var mock_list =[];

    //array에 그냥 push하는 게 아니라, {키:true} 이렇게 들어가야함
    firebase.database().ref('/userProfile/' + this.userId + '/m_list').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot){
                temp = childSnapshot.key;
                meeting_list.push(temp);
        })
        return meeting_list;
    }).then(function(res){
      res.forEach(function(key_){
        firebase.database().ref('/allMeeting/'+key_+'/title').once('value', function(snapshot){
          var title_:string = snapshot.val();
          console.log('title: '+title_);
          mock_list.push({title: title_});
      });
    },this);
  });

  this.title_list = mock_list;

  }

  makeNewMeeting() {

    let newMeetingKey, meeting_title: string;
    let updates = {};

    meeting_title = prompt("Meeting Title");

    //null일때는 key가 안들어가도록 수정해야함
    
    if (meeting_title !== null) {

      newMeetingKey =  firebase.database().ref('/userProfile/'+this.userId).child('m_list').push(true).key;
      console.log(newMeetingKey);

      firebase.database().ref('/allMeeting/'+newMeetingKey).child('member').child(this.userId).set(true);
      firebase.database().ref('/allMeeting/'+newMeetingKey).child('title').set(meeting_title);
      
    }
    //return firebase.database().ref().update(updates);

  }

  enterMeeting(code){

  //저거 들어가는게 실패했을 경우는 어떻게 판별하지???
  //입력끝나면 지워지도록!!
    firebase.database().ref('/userProfile/'+this.userId+'/m_list').child(code).set(true);
    firebase.database().ref('/allMeeting/'+code+'/member').child(this.userId).set(true);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingListPage');
  }

}