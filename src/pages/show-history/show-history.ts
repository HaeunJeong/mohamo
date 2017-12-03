import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,  public af: AngularFireDatabase,) {
  
    this.meetingTitle = navParams.get('meetingTitle');
    this.meetingCode = navParams.get('meetingCode');
    //console.log(this.meetingTitle+ "  "+this.meetingCode);
    this.meetingInfo = af.list('/allMeeting/' + this.meetingCode + '/infoToMeet');
  }



}
