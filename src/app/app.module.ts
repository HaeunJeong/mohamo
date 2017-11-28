import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

<<<<<<< HEAD
import { IonicPage, NavController, NavParams, Alert, AlertController } from 'ionic-angular';

import { MyApp } from './app.component';
import { MeetingListPage } from '../pages/meeting-list/meeting-list';
import { MatchingTimePage } from '../pages/matching-time/matching-time';

import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';

import { IndiPagePage } from '../pages/indiPage/indiPage';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {Geolocation} from '@ionic-native/geolocation';

import { GoogleMapPage } from '../pages/google-map/google-map';
import { IonicPageModule } from 'ionic-angular';

import { RulePage } from '../pages/rule/rule';
import { MemberinfoPage } from '../pages/memberinfo/memberinfo';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'Highcharts';

export const firebaseConfig = {
=======
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';
import { MypagePage } from '../pages/mypage/mypage';


var config = {
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  apiKey: "AIzaSyD64TztBapH_VB2-5YOUIJA3XeZFD-KzYk",
  authDomain: "term-project-setting.firebaseapp.com",
  databaseURL: "https://term-project-setting.firebaseio.com",
  projectId: "term-project-setting",
  storageBucket: "term-project-setting.appspot.com",
  messagingSenderId: "699164986456"
};

@NgModule({
  declarations: [
    MyApp,
<<<<<<< HEAD
    MeetingListPage,
    MatchingTimePage,
    IndiPagePage,
    GoogleMapPage,
    RulePage,
    MemberinfoPage
=======
    HomePage,
    LoginPage,
    SettingPage,
    MypagePage
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
<<<<<<< HEAD
    IonicPageModule.forChild(GoogleMapPage),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    ChartModule.forRoot(highcharts)
=======
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
<<<<<<< HEAD
    MeetingListPage,
    MatchingTimePage,
    IndiPagePage,
    GoogleMapPage,
    RulePage,
    MemberinfoPage
=======
    HomePage,
    LoginPage,
    SettingPage,
    MypagePage
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  ],
  providers: [
    StatusBar,
    SplashScreen,
<<<<<<< HEAD
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    EventProvider,
    ProfileProvider,
    Geolocation
=======
    {provide: ErrorHandler, useClass: IonicErrorHandler}
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  ]
})
export class AppModule {}
