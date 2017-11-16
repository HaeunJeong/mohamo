import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { MeetingListPage } from '../pages/meeting-list/meeting-list';
import { AuthProvider } from '../providers/auth/auth';
import { EventProvider } from '../providers/event/event';
import { ProfileProvider } from '../providers/profile/profile';

import { IndiPagePage } from '../pages/indiPage/indiPage';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {Geolocation} from '@ionic-native/geolocation';

export const firebaseConfig = {
  apiKey: "AIzaSyCjOFpcA7N5PMu6TRb9V9o9IcEtRF2Rxp0",
  authDomain: "eventmanager-eff47.firebaseapp.com",
  databaseURL: "https://eventmanager-eff47.firebaseio.com",
  projectId: "eventmanager-eff47",
  storageBucket: "eventmanager-eff47.appspot.com",
  messagingSenderId: "212380439220"
};

@NgModule({
  declarations: [
    MyApp,
    IndiPagePage,
    MeetingListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MeetingListPage,
    IndiPagePage
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
