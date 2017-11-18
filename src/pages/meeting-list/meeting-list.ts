import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

/**
 * Generated class for the MeetingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meeting-list',
  templateUrl: 'meeting-list.html',
})
export class MeetingListPage {

  userId;
  a;
  meeting_list = [];
  database = firebase.database();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId = firebase.auth().currentUser.uid;

    console.log(this.userId);

    /*
    this.database.ref('/userProfile/' + this.userId+'/m_list').once('value', (snapshot)=>{
      console.log(snapshot.val());
      snapshot.forEach(snap=>{
        console.log(snap.key);

        return false;
      })
    });
*/

    /*
    this.database.ref('/userProfile/' + this.userId).once('value')
          .then((snapshot)=>{ 
            snapshot.val().m_list.forEach(snap=>this.a=snap)}
            
      );*/

    
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingListPage');
  }

}
