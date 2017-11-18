import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  Loading,
  LoadingController,
  Alert,
  AlertController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingListPage } from '../../pages/meeting-list/meeting-list';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
/*
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    formBuilder: FormBuilder) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
      Validators.required])]
    });
  }

  signupUser(): void {
    if (!this.signupForm.valid) {

      console.log(`Need to complete the form: ${this.signupForm.value}`);

    } else {

      const email: string = this.signupForm.value.email; //this.signupForm.value.email 가 html에서 받아와진거야.
      const password: string = this.signupForm.value.password;
      this.authProvider.signupUser(email, password).then(user => {//여기서의 signupUser는 auth.ts에 있는거다.
        
        this.loading.dismiss().then(() => {
          this.navCtrl.setRoot(MeetingListPage);
        });
      }, error => {
        this.loading.dismiss().then(() => {
          const alert: Alert = this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: "Ok", role: "cancel" }]
          });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
*/
}
