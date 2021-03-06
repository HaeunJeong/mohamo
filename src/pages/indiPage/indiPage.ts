import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { CurrentLoc } from '../../app/interfaces/current-loc';
import { MatchingTimePage } from '../matching-time/matching-time';
import { RulePage } from '../rule/rule';
import { ShowHistoryPage } from '../show-history/show-history';
import { MemberinfoPage } from '../memberinfo/memberinfo';
import { MeetingListPage } from '../meeting-list/meeting-list';
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
  init_score = null;
  ppp_ttt;


  leader: string;

  

  constructor(
    public navCtrl: NavController,
    public af: AngularFireDatabase,
    public geolocation: Geolocation,
    public navParams: NavParams) {

    this.userId = firebase.auth().currentUser.uid;
    this.meetingCode = navParams.data;
    this.geo = this.geolocation;


    this.af.database.ref('/allMeeting/' + this.meetingCode + '/leader').once('value', (snapshot) => {
      //리더 id 얻기

      snapshot.forEach(snap => {
        console.log(snap.val());
        this.af.database.ref('/userProfile/' + snap.val()).once('value', (snapshot) => {
          snapshot.forEach(snap2 => {
            if (snap2.key == 'name') {
              this.leader = snap2.val();
              return false;
            }
          });
        });

        return false;
      })
    });

    let dataURL = this.af.database;

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

    //각 미팅별 month, day 체크=> 현재보다 지난 meeting일시 done 넣어주면서 화면에서 안 보이도록 만든다.
    this.meetingInfo.subscribe(
      meetArray => {
        var today = new Date();
        meetArray.forEach(meetInfo => {

          if (meetInfo.done == 'n') {
            var meetDateTemp1 = meetInfo.dateTime.split("월 ");
            var meetDateTemp2 = meetDateTemp1[1].split("일 ");
            var meetDateTemp3 = meetDateTemp2[1].split("-");
            var meetDateTemp4 = meetDateTemp3[1].split(":");

            var meetInfoMonth = meetDateTemp1[0];
            var meetInfoDay = meetDateTemp2[0];
            var meetInfoEndHr = meetDateTemp4[0];
            var meetInfoEndMin = meetDateTemp4[1];

            var todayMonth = today.getMonth() + 1;
            var todayDay = today.getDate();
            var TodayHr = today.getHours();
            var TodayMin = today.getMinutes();
            var absPenalty = 0;
            var userTotalPenalty;

            if (meetInfo.done == 'n' &&
              ((todayMonth > meetInfoMonth) ||
                (todayMonth == meetInfoMonth && todayDay > meetInfoDay) ||
                (todayMonth == meetInfoMonth && todayDay == meetInfoDay && TodayHr > meetInfoEndHr) ||
                (todayMonth == meetInfoMonth && todayDay == meetInfoDay && TodayHr == meetInfoEndHr && TodayMin > meetInfoEndMin))) {
              this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + meetInfo.$key + '/').update({ done: 'y' })

                .then(result => {
                  //미팅 종료 시간이 지나는 순간까지 안 오는 멤버는 결석처리!
                  this.af.database.ref('/allMeeting/' + this.meetingCode + '/penalty_absence').once('value', (getAbsencePenalty) => {
                    absPenalty = parseInt(getAbsencePenalty.val().split('점'));
                  })

                    .then(result => {


                      //개인의 현재 미팅 내 총 벌점 계산
                      firebase.database().ref('/allMeeting/' + this.meetingCode + '/member/' + this.userId + '/personal_penalty').once('value', function (snapshot2) {
                        userTotalPenalty = snapshot2.val();
                      })

                        .then(result => {
                          this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + meetInfo.$key + '/attendanceLog').once('value', (snapshot) => {
                            snapshot.forEach(snap => {
                              if (snap.val() == false) {
                                this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + meetInfo.$key + '/attendanceLog/' + snap.key).child('attLog').set('결석: 벌점 ' + absPenalty + '점');
                                firebase.database().ref('/allMeeting/' + this.meetingCode).child('member').child(this.userId).set({ personal_penalty: (absPenalty + userTotalPenalty) });
                              }
                              return false;
                            });
                          })
                        });



                    })

                });
            }
          }
        });

      }

    );
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

      //특정 모임 내의 약속 정보에 대한 코드
      var indiMeetCode;

      //오늘 날짜에 해당하는 미팅이 있는지 확인
      DBurl.ref('/allMeeting/' + this.meetingCode + '/infoToMeet').once('value', (snapshot) => {

        snapshot.forEach(snap => {

          if (snap.val().done == 'n' && snap.val().dateTime.indexOf(mm + "월 " + dd + "일") != -1) {
            indiMeetCode = snap.key;

            // 있으면 미팅 장소 좌표 얻어오기. 
            mtLat = snap.val().LatLon.lat;
            mtLon = snap.val().LatLon.lon;

            //12월 3일 15:00-17:00
            //정해진 미팅시간 받아오기. 
            var dtSplit = snap.val().dateTime.split("일 ");
            var dSplit = dtSplit[0].split("월 ");
            var tSplitTmp = dtSplit[1].split("-");
            var tSplit = tSplitTmp[0].split(":");

            meetingDate = new Date(2017, dSplit[0], dSplit[1], tSplit[0], tSplit[1]);
            timeLeft = (meetingDate.getTime() - todayTemp.getTime()) / 60000;

            meetingNum++;
            return false;
          }
        });

        if (meetingNum == 0) {
          alert("해당 모임은 오늘 예정된 미팅이 없습니다.");
          //return false;
        } else {
          alert("해당 모임은 오늘 예정된 약속이 " + meetingNum + "개 있습니다.");
        }
      }).then(result => {

        if (meetingNum != 0) {
          //지각 여부 체크
          if (timeLeft < 0) {
            //지각로그 남기기
            this.leaveLog(timeLeft, indiMeetCode);
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
                });
                //출석 로그 남기기
                this.leaveLog(timeLeft, indiMeetCode);
                return false;
              }
            });
          }
        }
      });

    }
  }

  leaveLog(timeLeft: number, indiMeetCode: string) {
    //벌점 체크하기
    var lateMin = null;
    var userTotalPenalty = 0;
    var penalty = 0;
    var lateMin2 = 0;


    //몇 분 지각당 벌점 1점씩 올라가는지.
    this.af.database.ref('/allMeeting/' + this.meetingCode + '/').once('value', (snapshot) => {
      snapshot.forEach(snap => {
        if (snap.key == 'setting_late') {
          lateMin = snap.val();
        }
        return false;
      })
    }).then(result => {
      lateMin2 = parseInt(lateMin.split("분"));

      //개인의 현재 미팅 내 총 벌점 계산
      firebase.database().ref('/allMeeting/' + this.meetingCode + '/member/' + this.userId + '/personal_penalty').once('value', function (snapshot2) {
        userTotalPenalty = snapshot2.val();
      });

    }).then(result => {
      if (timeLeft >= 0)
        userTotalPenalty = userTotalPenalty
      else {
        penalty = Math.floor(Math.abs(timeLeft) / lateMin2);
        userTotalPenalty += penalty;
      }
    }).then(result => {
      this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + indiMeetCode + '/attendanceLog/' + this.userId).once('value', (snapshot) => {
        //아직 출석 기록이 없을 경우
        if (snapshot.val() == false) {
          if (timeLeft >= 0) {
            this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + indiMeetCode + '/attendanceLog/' + this.userId).child('attLog').set('출석');
            alert("출석처리 되었습니다");
          } else {
            this.af.database.ref('/allMeeting/' + this.meetingCode + '/infoToMeet/' + indiMeetCode + '/attendanceLog/' + this.userId).child('attLog').set('지각 ' + Math.abs(timeLeft) + '분: 벌점 ' + penalty + '점');
            firebase.database().ref('/allMeeting/' + this.meetingCode).child('member').child(this.userId).set({ personal_penalty: userTotalPenalty });
            alert("당신은 " + Math.abs(timeLeft) + "분 지각하셨습니다.");
          }
          //이미 출석 한 경우
        } else {
          alert("이미 출석체크를 하셨습니다.");
        }
      });
    })
  }

  removeMember() {
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
      }
    });

    if (exist == false && toBeDeleted) {
      alert(toBeDeleted + "는(은) 이 미팅에 존재하지 않습니다.");
      return false;
    }

    var leaderCheck = this.af.database.ref('/allMeeting/' + this.meetingCode + '/leader');
    var amILeader = "n";
    leaderCheck.once('value', (snapshot) => {
      snapshot.forEach(snap => {
        if (snap.val() == this.userId) {
          amILeader = "y";
          return false;
        }
      })
    }).then(result => {
      if (amILeader == "y") {
        this.af.database.ref('/userProfile').once('value', (snapshot) => {
          snapshot.forEach(snap => {
            if (snap.val().name == toBeDeleted) {
              this.af.object('/allMeeting/' + this.meetingCode + '/member/' + snap.key).remove();
              this.af.object('/userProfile/' + snap.key + '/m_list/' + this.meetingCode).remove();
              return false;
            }
          });
        });
        alert(toBeDeleted + "(이)가 삭제 되었습니다.");
      }
      else {
        alert("방장만 멤버 삭제가 가능합니다.");
      }
    })
  }

  goEditMeetingInfoPage() {
    this.navCtrl.push(MatchingTimePage, this.meetingCode);
  }

  goEditMeetingRulePage() {
    //firebase.database().ref('/allMeeting/' +  this.meetingCode + '/member/').once('value').thenforEach(function (snapshot){


    var getThis = this;
    this.navCtrl.push(RulePage, { godata: getThis.meetingCode }, { animate: false });
  }

  goHistoryPage() {
    this.navCtrl.push(ShowHistoryPage, { meetingCode: this.meetingCode, meetingTitle: this.meetingTitle });
  }

  getOut() {
    if (confirm("미팅을 나가시겠습니까?")) {
      var idToDel = this.af.object('/allMeeting/' + this.meetingCode + '/member/' + this.userId);
      idToDel.remove();
      var meetingToDel = this.af.object('/userProfile/' + this.userId + '/m_list/' + this.meetingCode);
      meetingToDel.remove();
      this.navCtrl.push(MeetingListPage);
    }
  }

  GoMemInfo(mtMem) {
    console.log("a: ", mtMem[0].$key);
    this.navCtrl.push(MemberinfoPage, { gogodata: mtMem[0].$key });
  }

}