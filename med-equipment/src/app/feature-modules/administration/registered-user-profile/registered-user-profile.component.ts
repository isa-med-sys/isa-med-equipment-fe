import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisteredUser } from 'src/app/shared/model/registered-user';
import { AuthService } from 'src/app/authentication/auth.service';
import { AdministrationService } from '../administration.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registered-user-profile',
  templateUrl: './registered-user-profile.component.html',
  styleUrls: ['./registered-user-profile.component.scss']
})
export class RegisteredUserProfileComponent {

  userId?: number;
  user!: RegisteredUser;
  userProfileForm!: FormGroup;
  isEditable: boolean = false;
  errorMessage: string = '';

  constructor(private administrationService: AdministrationService, private fb: FormBuilder, authService: AuthService, private http: HttpClient) {
    this.userId = authService.user$.value.id;
  }

  ngOnInit() {
    if (this.userId) {
      this.administrationService.getRegisteredUser(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.initializeForm();
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        },
      });
    }
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
    if (this.userId && this.userProfileForm.valid) {
      const address = this.userProfileForm.get('address')?.value;
  
      this.getLatLongFromAddressOpenCage(address.street + ' ' + address.streetNumber + ' ' + address.city + ' ' + address.country)
        .subscribe({
          next: (locationResult: any) => {
            if (locationResult && locationResult.results && locationResult.results.length > 0) {
              const location = locationResult.results[0].geometry;
              const latitude = location.lat;
              const longitude = location.lng;
  
              const updatedUserData = this.userProfileForm.value;
              updatedUserData.address.latitude = latitude;
              updatedUserData.address.longitude = longitude;
  
              if (this.userId) {
                this.administrationService.updateRegisteredUser(this.userId, updatedUserData).subscribe({
                  next: (updatedUser) => {
                    console.log('User profile updated successfully:', updatedUser);
                    this.user = updatedUser;
                    this.isEditable = false;
                  },
                  error: (err) => {
                    this.errorMessage = err.status == 400 ? 'Wrong password!' : 'Unknown error while updating profile';
                  },
                });
              } else {
                console.error('Error: User ID is undefined.');
              }
            } else {
              console.error('Error: Unable to retrieve location information.');
            }
          },
          error: (err) => {
            console.error('Error fetching location:', err);
          },
        });
    }
  }

  discardChanges() {
    this.initializeForm();
    this.isEditable = false;
  }

  private getLatLongFromAddressOpenCage(address: string) {
    const apiKey = '7087c471f8054150abf1cd6421ae2324';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=en&limit=1`;
  
    return this.http.get(apiUrl);
  }
}
