import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { UserService } from '../user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  
  userId: number;
  user!: RegisteredUser;
  userProfileForm!: FormGroup;
  isEditable: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    // TODO load from session storage
    this.userId = 2;
  }

  ngOnInit() {
    this.userService.getRegisteredUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.initializeForm();
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  initializeForm() {
    this.userProfileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: [''],
      phoneNumber: [this.user.phoneNumber, Validators.required],
      occupation: [this.user.occupation, Validators.required],
      companyInfo: [this.user.companyInfo, Validators.required],
      address: this.fb.group({
        street: [this.user.address.street],
        streetNumber: [this.user.address.streetNumber],
        country: [this.user.address.country],
        city: [this.user.address.city]
      }),
    });
  }

  toggleEditMode() {
    this.isEditable = !this.isEditable;

    if (!this.isEditable) {
      this.initializeForm();
    }
  }

  saveChanges() {
    if (this.userProfileForm.valid) {
      const updatedUserData = this.userProfileForm.value;
      
      this.userService.updateRegisteredUser(this.userId, updatedUserData).subscribe({
        next: (updatedUser) => {
          console.log('User profile updated successfully:', updatedUser);
          this.user = updatedUser;
          this.isEditable = false;
        },
        error: (err) => {
          this.errorMessage = err.status == 400 ? 'Wrong password!' : 'Unknown error while updating profile';
        },
      });
    }
  }

  discardChanges() {
    this.initializeForm();
    this.isEditable = false;
  }
}
