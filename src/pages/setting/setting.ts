import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})


export class SettingPage {

  key_ = "-KaE0FHsxdXSP9wdIHl9"; //해당 미팅 방 코드
  member_name = [];
  penalty_text =[];
  member_key = "0"
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var temp;
    var member_id =[];
    var m_name = [];
    //setting 화면 해당 멤버 확인
      firebase.database().ref('/allMeeting/'+this.key_+'/member').once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          temp = childSnapshot.key; //member userId
          console.log("temp: ",temp);
          member_id.push(temp);
        })
        return member_id;   
  }).then(function(res){
    res.forEach(function(id){
      firebase.database().ref('/userProfile/'+id+'/name').once('value',function(snapshot){
        var name_ = snapshot.val();
        console.log("name: ",name_);
        m_name.push({name:name_});
      });
    })
  })
      this.member_name = m_name;
  }
 
  addPenalty(penalty){
    var temp;
    var penal_ =[];
    firebase.database().ref('/allMeeting/'+this.key_).child('penalty').push(penalty); //패널티를 새로 만들어 놓는 작업

    console.log("penalty:"+penalty);

    firebase.database().ref('/allMeeting/'+this.key_+'/penalty').once('value').then(function(snapshot){
      snapshot.forEach(function(childSnapshot){
        temp = childSnapshot.val(); //penalty text
        console.log("temp: ",temp);
        penal_.push({text:temp});
      })
    });

    this.penalty_text = penal_;
//새로 만들어 놓은 곳에 저장하는 작업
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  change_penal(something2)
  {
    
      console.log("Selected car"+ something2);
     
    //firebase.database().ref('/allMeeting/'+this.key_+'/member' + this.member_key).child('score').push(something2);
    //console.log("score:"+something2);
  }

  onSelectChange(selectedValue: any) {
    console.log('Selected', selectedValue);
  }

}
