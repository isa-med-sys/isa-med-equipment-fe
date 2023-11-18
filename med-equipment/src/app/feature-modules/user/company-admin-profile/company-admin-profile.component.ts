import { Component } from '@angular/core';
import { CompanyAdmin } from "../../../shared/model/company-admin";
import { UserService } from "../user.service";
import { AuthService } from "../../../authentication/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-company-admin-profile',
  templateUrl: './company-admin-profile.component.html',
  styleUrls: ['./company-admin-profile.component.scss']
})
export class CompanyAdminProfileComponent {

  adminId?: number;
  admin!: CompanyAdmin;
  isEditableAdmin: boolean = false;
  isEditableCompany: boolean = false;
  adminForm!: FormGroup;
  companyForm!: FormGroup;
  errorMessage: string = '';

  constructor(private userService: UserService, authService: AuthService, private fb: FormBuilder) {
    this.adminId = authService.user$.value.id;
  }

  ngOnInit() {
    if (this.adminId) {
      this.userService.getCompanyAdmin(this.adminId).subscribe({
        next: (user) => {
          this.admin = user;
          this.initializeForm();
        },
        error: (err) => {
          console.error('Error fetching admin profile:', err);
        }
      });
    }
  }

  initializeForm() {
    this.initializeAdminForm();
    this.initializeCompanyForm();
  }

  initializeAdminForm() {
    this.adminForm = this.fb.group({
      name: [this.admin.name, Validators.required],
      surname: [this.admin.surname, Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: [''],
      phoneNumber: [this.admin.phoneNumber, Validators.required],
      address: this.fb.group({
        street: [this.admin.address.street],
        streetNumber: [this.admin.address.streetNumber],
        country: [this.admin.address.country],
        city: [this.admin.address.city]
      })
    });
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      name: [this.admin.company.name, Validators.required],
      description: [this.admin.company.description, Validators.required],
      rating: [this.admin.company.rating, Validators.required],
      address: this.fb.group({
        street: [this.admin.company.address.street],
        streetNumber: [this.admin.company.address.streetNumber],
        country: [this.admin.company.address.country],
        city: [this.admin.company.address.city]
      }),
      equipment: [this.admin.company.equipment]
    });
  }

  toggleEditModeAdmin() {
    this.isEditableAdmin = !this.isEditableAdmin;

    if (!this.isEditableAdmin) {
      this.initializeAdminForm();
    }
  }

  toggleEditModeCompany() {
    this.isEditableCompany = !this.isEditableCompany;

    if (!this.isEditableCompany) {
      this.initializeCompanyForm();
    }
  }

  saveAdminChanges() {
    if (this.adminId && this.adminForm.valid) {
      const updatedData = this.adminForm.value;

      this.userService.updateCompanyAdmin(this.adminId, updatedData).subscribe({
        next: (updatedAdmin) => {
          console.log('User profile updated successfully:', updatedAdmin);
          this.admin = updatedAdmin;
          this.isEditableAdmin = false;
        },
        error: (err) => {
          this.errorMessage = err.status == 400 ? 'Wrong password!' : 'Unknown error while updating profile';
        }
      });
    }
  }

  saveCompanyChanges() {
    if (this.adminId && this.companyForm.valid) {
      const updatedData = this.companyForm.value;

      this.userService.updateCompany(this.admin.company.id, updatedData).subscribe({
        next: (result) => {
          console.log('Company updated successfully:', result);
          this.admin.company = result;
          this.isEditableCompany = false;
        },
        error: (err) => {
          this.errorMessage = err.text;
        }
      });
    }
  }

  discardChangesAdmin() {
    this.initializeAdminForm();
    this.isEditableAdmin = !this.isEditableAdmin;
    this.errorMessage = '';
  }

  discardChangesCompany() {
    this.initializeCompanyForm();
    this.isEditableCompany = !this.isEditableCompany;
    this.errorMessage = '';
  }
}
