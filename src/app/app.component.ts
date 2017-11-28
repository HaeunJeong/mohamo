import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
<<<<<<< HEAD
import { MeetingListPage } from '../pages/meeting-list/meeting-list';
import { MatchingTimePage } from '../pages/matching-time/matching-time';
import { RulePage } from '../pages/rule/rule';
import * as firebase from 'firebase';
=======

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36

@Component({
  templateUrl: 'app.html'
})
<<<<<<< HEAD


export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp({
      apiKey: "AIzaSyD64TztBapH_VB2-5YOUIJA3XeZFD-KzYk",
      authDomain: "term-project-setting.firebaseapp.com",
      databaseURL: "https://term-project-setting.firebaseio.com",
      projectId: "term-project-setting",
      storageBucket: "term-project-setting.appspot.com",
      messagingSenderId: "699164986456"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {

      this.rootPage = 'LoginPage';
      unsubscribe();
      /*
      // 정보가 바뀌지 않았으면, Login으로 가지말고 바로 MeetingListPage로 가도록!
          if(!user){
            this.rootPage = 'LoginPage';
            unsubscribe();
          }else{
            this.rootPage = MeetingListPage;
            unsubscribe();
          }
          */
        });
        

=======
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
<<<<<<< HEAD

  }
}
=======
  }
}

>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
