import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { AdministrationService } from '../administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  passwordForm = new FormGroup({
    password1: new FormControl('', [Validators.required]),
    password2: new FormControl('', [Validators.required]),
  });

  changePassword(): void {
    if(this.passwordForm.value.password1 && this.passwordForm.value.password2) {
      if(this.passwordForm.value.password1 == this.passwordForm.value.password2) {
        if(this.passwordForm.valid) {
          this.service.changePassword(this.authService.user$.value.id, this.passwordForm.value.password1).subscribe({
            next: (result) => {
              if(result)
                this.router.navigate(['/']);
              else console.log('Failed.');
            },
            error: (errorMessage) => {
              console.log(errorMessage);
            }
          });
        }
      }
      else this.snackBar.open('Passwords do not match.', 'Close', {
        duration: 30000,
      });
    }
  }
}
