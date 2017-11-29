import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MypagePage } from '../mypage/mypage';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';


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
 

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController) {
      this.userId = firebase.auth().currentUser.uid;
    this.schedules_sun = this.navParams.get('sun');
    this.schedules_mon = this.navParams.get('mon');
    this.schedules_tue = this.navParams.get('tue');
    this.schedules_wed = this.navParams.get('wed');
    this.schedules_thu = this.navParams.get('thu');
    this.schedules_fri = this.navParams.get('fri');
    this.schedules_sat = this.navParams.get('sat');
  }
  seclectbutton(schedule){ //상세일정 버튼 하나에 한개만 입력할 수 있넴...ㅠ
    if(schedule.value != false){
      var getThis = this;
      let newTodo: string = prompt("상세일정을 입력해 주세요");
      if(newTodo != ""){
        firebase.database().ref('/userProfile/' + getThis.userId + '/schedule/y_17/m_11')
        .child(schedule.date).child(schedule.day).child(schedule.time).set(newTodo);
      }
      let loader = getThis.loadingCtrl.create({
        content: "저장중...",
        duration: 5000
      });
  
      loader.present();
      setTimeout(function () {
        getThis.navCtrl.push(MypagePage);
      }, 5000);
    }
  }

  addSchedule() {
    
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SetTodoPage');
  }

}
