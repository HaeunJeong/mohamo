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
    MeetingListPage,
    MatchingTimePage,
    IndiPagePage,
    GoogleMapPage,
    RulePage,
    MemberinfoPage
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
    MemberinfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    EventProvider,
    ProfileProvider,
    Geolocation
  ]
})
export class AppModule {}
