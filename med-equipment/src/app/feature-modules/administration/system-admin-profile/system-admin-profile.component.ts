import { Component } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { SystemAdmin } from 'src/app/shared/model/system-admin';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.scss']
})
export class SystemAdminProfileComponent {

  companies!: Company[];
  isCompanyFormVisible: boolean = false;
  isAdminFormVisible: boolean = false;
  isSysAdminFormVisible: boolean = false;
  errorMessage: string = '';
  companyForm!: FormGroup;
  adminForm!: FormGroup;
  sysAdminForm!: FormGroup;
  selectedCompanyId: number = 0;

  constructor(private administrationService: AdministrationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getData();
  }

  addNewCompany(): void {
    this.isCompanyFormVisible = true;
    this.isAdminFormVisible = false;
    this.isSysAdminFormVisible = false;
  }

  addNewAdmin(company: number): void {
    this.isCompanyFormVisible = false;
    this.isAdminFormVisible = true;
    this.isSysAdminFormVisible = false;
    this.selectedCompanyId = company;
  }

  addNewSysAdmin(): void {
    this.isCompanyFormVisible = false;
    this.isAdminFormVisible = false;
    this.isSysAdminFormVisible = true;
  }

  cancelCompanyCreation(): void {
    this.isCompanyFormVisible = false;
    this.initializeCompanyForm();
  }

  cancelAdminCreation(): void {
    this.isAdminFormVisible = false;
    this.initializeAdminForm();
  }

  cancelSysAdminCreation(): void {
    this.isSysAdminFormVisible = false;
    this.initializeSysAdminForm();
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
    });
  }

  initializeSysAdminForm() {
    this.sysAdminForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['admin'],
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

  saveSysAdmin(): void {
    console.log('rerrrna');
    if (this.sysAdminForm.valid) {
      let administrator: SystemAdmin = this.sysAdminForm.value;
      this.administrationService.addSysAdmin(administrator).subscribe({
        next: (newAdmin) => {
          console.log('SysAdmin created successfully.');
          // this.getData(); mozda sys admin tabla
          this.isSysAdminFormVisible = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getData(): void {
    this.administrationService.getCompanies().subscribe({ //pgr izgl
      next: (companies) => {
        this.companies = companies;
  
        for (let i = 0; i < this.companies.length; i++) {
          this.administrationService.getAdminsByCompanyId(this.companies[i].id)
            .subscribe({
              next: (admins) => {
                this.companies[i].admins = admins;
              },
              error: (err) => {
                console.error(`Error fetching admins for company ${this.companies[i].id}:`, err);
              },
            });
        }
  
        this.initializeCompanyForm();
        this.initializeAdminForm();
        this.initializeSysAdminForm();
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }
}
