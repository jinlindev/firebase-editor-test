import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject(null);

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(res => {
      this.user.next(res);
      if (res) {
        this.router.navigate(['/home']);
      }
    });
  }

  googleAuth() {
    return this.login(new auth.GoogleAuthProvider());
  }

  login(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
      console.log('You have been successfully logged in!', result)
      this.user.next(result.user);
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.log(error)
    })
  }

  logout() {
    this.afAuth.signOut().then(res => {
      this.user.next(null);
      this.router.navigate(['/login']);
    }).catch(err => {
      console.log(err)
    });
  }
}
