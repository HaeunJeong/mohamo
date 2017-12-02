import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { CurrentLoc } from '../../app/interfaces/current-loc';
import { MatchingTimePage } from '../matching-time/matching-time';
import { RulePage } from '../rule/rule';

import { MemberinfoPage } from '../memberinfo/memberinfo';


@Component({
  selector: 'page-indiPage',
  templateUrl: 'indiPage.html'
})
export class IndiPagePage {

  afMtMembers: FirebaseListObservable<any[]>;
  meetingInfo: FirebaseListObservable<any[]>;
  allUserProfile: FirebaseListObservable<any[]>;
  memberTobeDeleted: FirebaseObjectObservable<any[]>
  mtMemNames: any[];
  //해당 미팅의 멤버 정보 통째로 들어가 있는 array!
  mtMemList: any[] = [];

  //로그인한 사용자의 이름, 현재 위치
  userName: string;
  userId: string;
  myCurrentLoc: CurrentLoc = { lat: 0, lon: 0 };

  meetingCode: string;
  meetingTitle: string = null;
  geo;

  constructor(
    public navCtrl: NavController,
    public af: AngularFireDatabase,
    public geolocation: Geolocation,
    public navParams: NavParams) {

    this.userId = firebase.auth().currentUser.uid;
    this.meetingCode = navParams.data;
    this.geo = this.geolocation;

    //this.navCtrl.push(RulePage, {godata: this.meetingCode});//rulepage로 데이터 이동
    let dataURL = this.af.database;
    console.log("meetingcode", this.meetingCode)
    //미팅 이름 얻기 OK
    dataURL.ref('/allMeeting').once('value', (snapshot) => {
      snapshot.forEach(snap => {
        if (snap.key == this.meetingCode) {
          this.meetingTitle = snap.val().title;
          return false;
        }
      });
    });

    //사용자 key 기반, 이름 얻기 OK
    dataURL.ref('/userProfile').once('value', (snapshot) => {
      snapshot.forEach(snap => {
        if (snap.key == this.userId) {
          this.userName = snap.val().name;
          return false;
        }
      });
    });

    //해당 미팅의 user 정보 (json) 전부 mtMemList에 담기 OK
    this.allUserProfile = af.list('/userProfile');
    this.afMtMembers = af.list('/allMeeting/' + this.meetingCode + '/member');


    this.afMtMembers.subscribe(
      membersArray => {
        this.mtMemNames = membersArray;

        this.allUserProfile.forEach(users => {

          this.mtMemList.splice(0, this.mtMemList.length);

          this.mtMemNames.forEach(memKeys => {
            var temp;
            temp = users.filter(user => user.$key == memKeys.$key);

            if (temp.length != 0) {
              this.mtMemList.push(temp);
            }
          });
        });
      }
    );


    
    //해당 모임 약속 시간 정보 가져오기 OK
    this.meetingInfo = af.list('/allMeeting/' + this.meetingCode + '/infoToMeet');
  }

 
  //출석 위해 자기 이름 클릭시 발생하는 이벤트
  //미팅은 하루에 한번만 있는 걸로 가정. 
  attendanceCheck(member: any) {

    //본인 이름 클릭
    if (member.name == this.userName) {

      //기존에 출석 되어 있는지 체크 -> 해야해!

      let DBurl = this.af.database;

      //현재 시간 얻기
      var meetingDate;
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      var hrs = today.getHours();
      var mins = today.getMinutes();
      var todayTemp = new Date(yyyy, mm, dd, hrs, mins);
      var timeLeft;

      var mtLat = null;
      var mtLon = null;

      var meetingNum = 0;

      //오늘 날짜에 해당하는 미팅이 있는지 확인
      DBurl.ref('/allMeeting/' + this.meetingCode + '/infoToMeet').once('value', (snapshot) => {

        snapshot.forEach(snap => {

          if (snap.val().dateTime.indexOf(yyyy + "-" + mm + "-" + dd) != -1) {

            // 있으면 미팅 장소 좌표 얻어오기. 
            mtLat = snap.val().LatLon.lat;
            mtLon = snap.val().LatLon.lon;

            //정해진 미팅시간 받아오기. 
            var dtSplit = snap.val().dateTime.split(" ");
            var dSplit = dtSplit[0].split("-");
            var tSplit = dtSplit[1].split(":");
            meetingDate = new Date(dSplit[0], dSplit[1], dSplit[2], tSplit[0], tSplit[1]);
            timeLeft = (meetingDate.getTime() - todayTemp.getTime()) / 60000;

            alert("해당 모임은 오늘 약속이 있습니다.");

            meetingNum++;
            return false;
          }
        });

        if (meetingNum == 0) {
          alert("해당 모임은 오늘 약속이 없습니다.");
        }

        return false;

      }).then(result => {

        if (meetingNum != 0) {
          //지각 여부 체크
          if (timeLeft < 0) {
            alert("당신은 " + Math.abs(timeLeft) + "분 지각하셨습니다.");
          }
          else if (timeLeft > 10) {
            alert("출석은 모임 시간 10분 전 부터 가능합니다.");
          } else {

            //현재 위치 얻어서 출석체크
            // 현재 위치 얻기
            this.geo.getCurrentPosition().then(pos => {
              this.myCurrentLoc.lat = pos.coords.latitude;
              this.myCurrentLoc.lon = pos.coords.longitude;
              this.myCurrentLoc.timestamp = pos.timestamp;
              console.log(this.myCurrentLoc.lat, this.myCurrentLoc.lon)
              return 1;

            }).then(temp => {

              //위도 좌표 값 비교해서 진짜 그 자리에 있는지 확인. 
              if (Math.abs(this.myCurrentLoc.lat - mtLat) > 0.03 || Math.abs(this.myCurrentLoc.lon - mtLon) > 0.03) {
                alert("당신은 모임 장소가 아닙니다. :( 어서 가세요!");
              } else {
                DBurl.ref('/userProfile/' + this.userId + '/LatLonDiff/').set({
                  //미팅장소와 현재 장소와의 차이 절대값 계산
                  lat: Math.abs(this.myCurrentLoc.lat - mtLat),
                  lon: Math.abs(this.myCurrentLoc.lon - mtLon),
                  meetingCode: this.meetingCode
                  //출석 로그 남기기 ->해야 해. 
                });
                return false;
              }
            });
          }
        }
      });

    }
  }



  removeMember() {
    let intoToDelete = this.af.database.ref('/allMeeting/' + this.meetingCode + '/memToBeDeleted');
    let memTobeDeleted: FirebaseObjectObservable<any[]>;
    let toBeDeleted: string = prompt("누굴 삭제할까요");

    if (toBeDeleted == null) {
      return false;
    }

    //1. 본인 이름을 입력했을 경우 기능 작동 x
    if (toBeDeleted == this.userName) {
      alert("본인입니다.\n 모임 나가기를 원하실 경우 하단의 \'모임탈퇴\'버튼을 눌러주세요.");
      return false;
    }

    //2. 삭제 멤버 존재 유무 확인
    let exist = false;
    this.mtMemList.forEach(mtMem => {
      if (toBeDeleted == mtMem[0].name) {
        exist = true;
        //alert("다른 멤버가 승인시 삭제가 완료됩니다.");
      }
    });

    if (exist == false && toBeDeleted) {
      alert(toBeDeleted + "는(은) 이 미팅에 존재하지 않습니다.");
      return false;
    }

    //해당 멤버 존재시, DB에 삭제 요청 등록
    //한 명의 삭제가 끝나기 전까지 다른 멤버 삭제 불가.(일단은)
    intoToDelete.once('value', (snapshot) => {
      if (!snapshot.exists()) {
        let reasonForDel: string = prompt("삭제 이유를 입력하세요.");

        intoToDelete.push({ who: toBeDeleted, reason: reasonForDel, agreeCur: this.mtMemList.length - 1, agreeMax: 0 });
        /*
        snapshot.forEach(snap => {
          if (snap.val().name == toBeDeleted) {
            memTobeDeleted = this.af.object('/member/' + snap.key);
            //memTobeDeleted.remove();
            return false;
          }
        });*/
        alert("다른 멤버가 승인시 삭제가 완료됩니다.");
      } else {
        alert("기존 멤버 삭제가 진행중입니다.\n해당 건이 끝난후 신청바랍니다.")
      }
    })

    /*
    test.ref('/allMeeting/'+this.meetingCode).once('value', (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(snap => {
          if (snap.val().name == toBeDeleted) {
            memTobeDeleted = this.af.object('/member/' + snap.key);
            //memTobeDeleted.remove();
            return false;
          }
        });
      }
    });*/
  }

  goMemberInfoPage() {
    this.navCtrl.push(MemberinfoPage, this.userId);
  }

  goEditMeetingRulePage() {
    this.navCtrl.push(RulePage, {godata: this.meetingCode}, { animate: false });
  }

  goEditMeetingInfoPage() {
    this.navCtrl.push(MatchingTimePage, this.meetingCode);
  }

}
