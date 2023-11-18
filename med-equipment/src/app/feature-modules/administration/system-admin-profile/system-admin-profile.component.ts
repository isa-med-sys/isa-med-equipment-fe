import { Component } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.scss']
})
export class SystemAdminProfileComponent {

  companies!: Company[];
  isCompanyFormVisible: boolean = false;
  isAdminFormVisible: boolean = false;
  errorMessage: string = '';
  companyForm!: FormGroup;
  adminForm!: FormGroup;
  selectedCompanyId: number = 0;

  constructor(private administrationService: AdministrationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getData();
  }

  addNewCompany(): void {
    this.isCompanyFormVisible = true;
    this.isAdminFormVisible = false;
  }

  addNewAdmin(company: number): void {
    this.isCompanyFormVisible = false;
    this.isAdminFormVisible = true;
    this.selectedCompanyId = company;
  }

  cancelCompanyCreation(): void {
    this.isCompanyFormVisible = false;
    this.initializeCompanyForm();
  }

  cancelAdminCreation(): void {
    this.isAdminFormVisible = false;
    this.initializeAdminForm();
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        streetNumber: ['', [Validators.required]],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
      }),
    });
  }

  initializeAdminForm() {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['admin'],
      companyId: [0],
      address: this.fb.group({
        street: ['', [Validators.required]],
        streetNumber: ['', [Validators.required]],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
      }),
    });
  }

  saveCompany(): void {
    if (this.companyForm.valid) {
      this.administrationService.addCompany(this.companyForm.value).subscribe({
        next: (newCompany) => {
          console.log('Company created successfully.');
          this.getData();
          this.isCompanyFormVisible = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  saveAdmin(): void {
    if (this.adminForm.valid) {
      let administrator: CompanyAdmin = this.adminForm.value;
      administrator.companyId = this.selectedCompanyId;
      this.administrationService.addAdmin(administrator).subscribe({
        next: (newAdmin) => {
          console.log('Admin created successfully.');
          this.getData();
          this.isAdminFormVisible = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getData(): void {
    this.administrationService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.initializeCompanyForm();
        this.initializeAdminForm();
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }
}
