import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginPage } from '../pages/login/login';
import { SettingPage } from '../pages/setting/setting';
import { MypagePage } from '../pages/mypage/mypage';


var config = {
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
    HomePage,
    LoginPage,
    SettingPage,
    MypagePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SettingPage,
    MypagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
