//import firebase from 'firebase';
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor() { }

  
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        return new Promise((resolve, reject) => {
          if (user) {
            user.newPropertyIamCreating = "New value I'm adding";
            resolve(user);
          } else {
            reject(Error);
          }
        });
      });
  }

  signupUser(email: string, password: string, name:string,phone_number:string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebase.database().ref(`/userProfile/${newUser.uid}/email`)
          .set(email);
        console.log('name: '+name);
        firebase.database().ref(`/userProfile/${newUser.uid}/name`)
          .set(name);
        firebase.database().ref(`/userProfile/${newUser.uid}/phone_number`)
          .set(phone_number);
        firebase.database().ref(`/userProfile/${newUser.uid}/LatLonDiff/lat`)
          .set(1000);
          firebase.database().ref(`/userProfile/${newUser.uid}/LatLonDiff/lon`)
          .set(1000);
          firebase.database().ref(`/userProfile/${newUser.uid}/LatLonDiff/meetingCode`)
          .set('');

      }).catch(error => console.error(error));
  }

  resetPassword(email: string): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase.database().ref(`/userProfile/${userId}`).off();
    return firebase.auth().signOut();
  }
}
