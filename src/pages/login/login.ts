//import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  Alert,
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
<<<<<<< HEAD
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { MeetingListPage } from '..//meeting-list/meeting-list';
=======

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { EmailValidator } from '../../validators/email';
//import { AuthProvider } from '../../providers/auth/auth';
//import { MeetingListPage } from '..//meeting-list/meeting-list';
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
<<<<<<< HEAD

=======
/*
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
  public loginForm:FormGroup;
  public loading:Loading;

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController, public alertCtrl:AlertController,
    public authProvider:AuthProvider, formBuilder:FormBuilder) {

      this.loginForm = formBuilder.group({
<<<<<<< HEAD
        email: ['nicehe74@gmail.com', Validators.compose([Validators.required,
        EmailValidator.isValid])],
        password: ['dkwkdkwk77', Validators.compose([Validators.required,
=======
        email: ['21300709@handong.edu', Validators.compose([Validators.required,
        EmailValidator.isValid])],
        password: ['123456', Validators.compose([Validators.required,
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
        Validators.minLength(6)])]
        });
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginUser():void {
    if(!this.loginForm.valid){
      console.log(`Form isn't valid yet, value: ${this.loginForm.value}`)
    } 
    else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authProvider.loginUser(email, password).then( authData => {
        this.loading.dismiss().then( () => {
        this.navCtrl.setRoot(MeetingListPage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
        const alert:Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: "Ok", role: 'cancel'}]
        });
          alert.present()
        });
      });
      
      this.loading = this.loadingCtrl.create();
      this.loading.present()
    }
  }

  goToSignup():void {
      this.navCtrl.push('SignupPage');
  }
  goToResetPassword():void {
      this.navCtrl.push('ResetPasswordPage');
<<<<<<< HEAD
  }
=======
  }*/
>>>>>>> 6274faa27e80f442b180322a535cb0a67b5c0e36
}
