import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  constructor(
    private service: UserService,
    private authService: AuthService,
    private router: Router
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
      else alert('Passwords do not match');
    }
  }
}
