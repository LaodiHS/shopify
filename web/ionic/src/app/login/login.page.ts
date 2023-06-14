import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';
import { TextareaChangeEventDetail } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GoogleAuthProvider} from 'firebase/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email!: string;
  password!: string;
  loginForm!: FormGroup;
  serverError!:string;
  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private router: Router,private formBuilder: FormBuilder
  ) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
    });


  }

  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      // User is authenticated, redirect to protected page or home page
      console.log('credentials', userCredential);
      // this.navCtrl.navigateRoot('/tabs');
      this.router.navigate(['/tabs'], { replaceUrl: true });
    } catch (error: any) {
      try {
        // const description = axios.get('/fireBaseErrors')
      } catch (error) {}

      console.log('Login error:', error.code);

      // Handle login error, display error message to the user
    }
  }

  onTextareaChangePassword(event: any) {
    const textareaValue = event.detail.value;
    console.log('Textarea value:', textareaValue);
  }
  onTextareaChangeEmail(event: any) {
    const textareaValue = event.detail.value;
    // this.email= textareaValue
    console.log('Textarea value:', textareaValue);
  }

  isValidLoginForm(): any{
    // console.log('email', this.email)
   const emailControl: any = this.loginForm.get('email')
   const passwordControl: any = this.loginForm.get('password');

  const isEmailValid = emailControl.valid;
  const isPasswordValid = passwordControl.valid;

  if (!isEmailValid) {
    // Handle invalid email input
    // ...
  }

  if (!isPasswordValid) {
    // Handle invalid password input
    // ...
  }
console.log("email",isEmailValid,'pasword', isPasswordValid)
  return isEmailValid && isPasswordValid;
  }
  async loginWithGoogle() {
    try {
      const { user } = await this.afAuth.signInWithPopup(
        new GoogleAuthProvider()
      );
      // Login with Google successful, perform any additional actions
      console.log('User logged in with Google:', user);
      this.router.navigate(['/tabs'], { replaceUrl: true });
    } catch (error) {
      // Handle any errors during Google login
      console.error('Error logging in with Google:', error);
    }
  }

}
