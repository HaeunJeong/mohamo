import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';

import { MyApp } from './app.component';
import { MeetingListPage } from '../pages/meeting-list/meeting-list';
import { MatchingTimePage } from '../pages/matching-time/matching-time';

import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';

import { IndiPagePage } from '../pages/indiPage/indiPage';
<<<<<<< HEAD
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {Geolocation} from '@ionic-native/geolocation';
=======
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
>>>>>>> sj

import { GoogleMapPage } from '../pages/google-map/google-map';
import { IonicPageModule } from 'ionic-angular';

import { RulePage } from '../pages/rule/rule';
import { MemberinfoPage } from '../pages/memberinfo/memberinfo';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'Highcharts';

<<<<<<< HEAD
export const firebaseConfig = {
  apiKey: "AIzaSyD64TztBapH_VB2-5YOUIJA3XeZFD-KzYk",
  authDomain: "term-project-setting.firebaseapp.com",
  databaseURL: "https://term-project-setting.firebaseio.com",
  projectId: "term-project-setting",
  storageBucket: "term-project-setting.appspot.com",
  messagingSenderId: "699164986456"
=======
import { MypageSchedulePage } from '../pages/mypage-schedule/mypage-schedule';
import { SetSchedulePage } from '../pages/set-schedule/set-schedule';
import { SetTodoPage } from '../pages/set-todo/set-todo'

export const firebaseConfig = {
  apiKey: "AIzaSyCjOFpcA7N5PMu6TRb9V9o9IcEtRF2Rxp0",
  authDomain: "eventmanager-eff47.firebaseapp.com",
  databaseURL: "https://eventmanager-eff47.firebaseio.com",
  projectId: "eventmanager-eff47",
  storageBucket: "eventmanager-eff47.appspot.com",
  messagingSenderId: "212380439220"
>>>>>>> sj
};

@NgModule({
  declarations: [
    MyApp,
    MeetingListPage,
    MatchingTimePage,
    IndiPagePage,
    GoogleMapPage,
    RulePage,
<<<<<<< HEAD
    MemberinfoPage
=======
    MemberinfoPage,
    MypageSchedulePage,
    SetSchedulePage,
    SetTodoPage
>>>>>>> sj
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(GoogleMapPage),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    ChartModule.forRoot(highcharts)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MeetingListPage,
    MatchingTimePage,
    IndiPagePage,
    GoogleMapPage,
    RulePage,
<<<<<<< HEAD
    MemberinfoPage
=======
    MemberinfoPage,
    MypageSchedulePage,
    SetSchedulePage,
    SetTodoPage
>>>>>>> sj
  ],
  providers: [
    StatusBar,
    SplashScreen,
<<<<<<< HEAD
    {provide: ErrorHandler, useClass: IonicErrorHandler},
=======
    { provide: ErrorHandler, useClass: IonicErrorHandler },
>>>>>>> sj
    AuthProvider,
    EventProvider,
    ProfileProvider,
    Geolocation
  ]
})
<<<<<<< HEAD
export class AppModule {}
=======
export class AppModule { }
>>>>>>> sj
