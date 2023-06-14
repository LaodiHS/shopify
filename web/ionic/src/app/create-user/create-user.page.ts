import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async register() {
    if (this.registrationForm.valid) {
      const { firstName, lastName, email, password } =
        this.registrationForm.value;
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
        );
        // User registration successful, perform any additional actions
        console.log('User registered successfully', userCredential.user);
      } catch (error) {
        // Handle any errors during user registration
        console.error('Error registering user:', error);
      }
    } else {
      // Form is not valid, display validation errors
      console.log('Invalid form');
    }
  }

  isValidRegistrationForm() {
    return this.registrationForm.valid;
  }

  onTextareaChangeFirstName(event: any) {
    const firstName = event.detail.value;
    // Handle any custom logic when the first name changes
  }

  onTextareaChangeLastName(event: any) {
    const lastName = event.detail.value;
    // Handle any custom logic when the last name changes
  }

  onTextareaChangeEmail(event: any) {
    const email = event.detail.value;
    // Handle any custom logic when the email changes
  }
}
