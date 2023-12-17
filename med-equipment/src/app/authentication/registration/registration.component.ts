import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  isButtonDisabled = true;
  passwordMessage = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.registrationForm.valid || !this.passwordsMatch();
    });
  }

  passwordConfirmation = new FormControl('', [Validators.required]);

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    companyInfo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    address: new FormGroup({
      street: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
    }),
  });

  passwordsMatch(): boolean {
    const password = this.registrationForm.get('password')?.value;
    const confirmPassword = this.passwordConfirmation.value;

    this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';

    return password === confirmPassword;
  }

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || '',
      surname: this.registrationForm.value.surname || '',
      email: this.registrationForm.value.email || '',
      occupation: this.registrationForm.value.occupation || '',
      phoneNumber: this.registrationForm.value.phoneNumber || '',
      companyInfo: this.registrationForm.value.companyInfo || '',
      password: this.registrationForm.value.password || '',

      address: {
        street: this.registrationForm.value.address?.street ?? '',
        streetNumber: this.registrationForm.value.address?.streetNumber ?? '',
        country: this.registrationForm.value.address?.country ?? '',
        city: this.registrationForm.value.address?.city ?? '',
      },
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.openSnackBar('Registration successful! Check your email for the confirmation link.');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.openSnackBar('An error occurred during registration.');
        }
      });
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }
}