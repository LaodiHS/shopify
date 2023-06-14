import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private navCtrl: NavController) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {

          
          resolve(true); // User is authenticated, allow access to the route
        } else {
          this.navCtrl.navigateRoot('/login'); // User is not authenticated, redirect to login page
          resolve(false);
        }
      });
    });
  }
}
