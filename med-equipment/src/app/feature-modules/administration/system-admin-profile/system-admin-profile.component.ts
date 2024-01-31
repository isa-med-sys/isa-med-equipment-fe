import { Component } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from 'src/app/shared/model/company';
import { CompanyAdmin } from 'src/app/shared/model/company-admin';
import { SystemAdmin } from 'src/app/shared/model/system-admin';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-system-admin-profile',
  templateUrl: './system-admin-profile.component.html',
  styleUrls: ['./system-admin-profile.component.scss']
})
export class SystemAdminProfileComponent {

  companies!: Company[];
  isAdminFormVisible: boolean = false;
  companyForm!: FormGroup;
  adminForm!: FormGroup;
  sysAdminForm!: FormGroup;
  selectedCompanyId: number = 0;
  selectedCompanyName: string = '';

  constructor(private administrationService: AdministrationService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.initializeAdminForm();
    this.initializeCompanyForm();
    this.initializeSysAdminForm();
    this.getData();
  }

  addNewAdmin(companyId: number): void {
    this.isAdminFormVisible = true;
    this.selectedCompanyId = companyId;

    const selectedCompany = this.companies.find(company => company.id == companyId);
    this.selectedCompanyName = selectedCompany ? selectedCompany.name : '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addNewSysAdmin(): void {
    this.isAdminFormVisible = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelCompanyCreation(): void {
    this.initializeCompanyForm();
  }

  cancelAdminCreation(): void {
    this.initializeAdminForm();
  }

  cancelSysAdminCreation(): void {
    this.initializeSysAdminForm();
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        streetNumber: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
      }),
      workStartTime: ['', Validators.required],
      workEndTime: ['', Validators.required],
      //worksOnWeekends: ['', Validators.required],
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
      const address = this.companyForm.get('address')?.value;
  
      this.getLatLongFromAddressOpenCage(address.street + ' ' + address.streetNumber + ' ' + address.city + ' ' + address.country)
        .subscribe({
          next: (locationResult: any) => {
            if (locationResult && locationResult.results && locationResult.results.length > 0) {
              const location = locationResult.results[0].geometry;
              const latitude = location.lat;
              const longitude = location.lng;
  
              const companyData = this.companyForm.value;
              companyData.address.latitude = latitude;
              companyData.address.longitude = longitude;
  
              this.administrationService.addCompany(companyData).subscribe({
                next: (newCompany) => {
                  console.log('Company created successfully.');
                  this.getData();
                },
                error: (err) => {
                  console.log(err);
                },
              });
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

  saveAdmin(): void {
    if (this.adminForm.valid) {
      let administrator: CompanyAdmin = this.adminForm.value;
      administrator.companyId = this.selectedCompanyId;
      this.administrationService.addAdmin(administrator).subscribe({
        next: (newAdmin) => {
          console.log('Admin created successfully.');
          this.getData();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  saveSysAdmin(): void {
    if (this.sysAdminForm.valid) {
      let administrator: SystemAdmin = this.sysAdminForm.value;
      this.administrationService.addSysAdmin(administrator).subscribe({
        next: (newAdmin) => {
          console.log('SysAdmin created successfully.');
          // sys t r
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getData(): void {
    this.administrationService.getCompanies().subscribe({ //pgr
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
        this.initializeAdminForm();
        this.initializeCompanyForm();
        this.initializeSysAdminForm();
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  private getLatLongFromAddressOpenCage(address: string) {
    const apiKey = '7087c471f8054150abf1cd6421ae2324';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=en&limit=1`;
  
    return this.http.get(apiUrl);
  }
}
