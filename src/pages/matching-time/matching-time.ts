import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingListPage } from '../meeting-list/meeting-list';
import * as firebase from 'firebase';

/**
 * Generated class for the MatchingTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.meeting_code = "-KyuKa3Pe2mDZpcKaMIt";

  }

  ionViewDidEnter(){
    // member아래로 접근하여 각 member마다 돌면서, schedule에 있는 key값들을 가져와 array에 저장.
    // key 값 가져올떄, 7:00-7:30 이런 형태이니까 걍 스트링으로 받아서 가져와
    // 오늘 날짜를 기준으로, 1주일을 가져온다. 
    // 
    var temp:String;
    var member_list=[]; //모임에 속한 member들의 key
    var temp_list =[];

    var total_time = ['t_7','t_8','t_9','t_10','t_11','t_12','t_13','t_14','t_15'];
    var arr = [];

    var meetingDate;
    var today = new Date();
    var m = today.getMonth() + 1;
    var d = today.getDate()-1;
    var mm = 'm_'+m;
    var dd = 'd_'+d;

    console.log(mm+':'+dd);
    
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

      //var num = member_list.length;
      // 각 member들의 스케쥴에 접근하여, 겹치는걸 조사
      
      res.forEach(function(member_id){//각 member id를 forEach 돌리기
        //var id = member_id;
        var j=0;
        firebase.database().ref('userProfile/'+member_id+'/schedule/y_17/'+mm+'/'+dd)
        .once('value').then(function(snapshot){
           snapshot.forEach(function(childSnapshot){
             //모든 시간들이 default false로 들어가 있다는 가정하에,
             //모든 member의 같은 날의 시간을 돌면서, 
             // 일정이 있는(==false가 아닌) key값들을 가져가다 arr에 넣는다.
             
             if(childSnapshot.val()){
               if(arr.indexOf(childSnapshot.key)==-1){
                  arr.push(childSnapshot.key);
                  console.log(member_id+', arr['+j+']: '+arr[j]);
                  j++;
               }  
             }
            
          })
          return arr;
          //arr에는 모든 멤버들의 일정이 하나라도 있는 시간대가 다 들어가 있음
      }).then(function(res){
        //total_time에서 위에서 받은 arr에 해당하는 시간이 있다면 삭제!
        var len = total_time.length;

        for(var i=0; i<len; i++){
          if(arr[i]=='undefined')
                break;
          
          var index = total_time.indexOf(arr[i], 0);
          if (index > -1) {
             total_time.splice(index, 1);
             console.log('remove:'+arr[i]);
          }
          
        }
        

      }) 
    })
  });

  this.times = total_time; // 일정이 없는 시간대만 남음.

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchingTimePage');
  }

}
