import { Component, ViewChild } from '@angular/core';
import { CompanyAdmin } from "../../../shared/model/company-admin";
import { AuthService } from "../../../authentication/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdministrationService } from '../administration.service';
import { MatTableDataSource } from "@angular/material/table";
import { Equipment } from "../../../shared/model/equipment";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

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
  admins: CompanyAdmin[] = [];

  // Equipment list
  displayedColumns: string[] = ['quantity', 'name', 'description', 'type', 'actions'];
  dataSource: MatTableDataSource<Equipment>;
  page: number = 0;
  size: number = 5;
  totalEquipment = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  type: string = '';
  rating: number = 0;

  equipment: Equipment[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private administrationService: AdministrationService, authService: AuthService, private fb: FormBuilder) {
    this.adminId = authService.user$.value.id;

    this.dataSource = new MatTableDataSource<Equipment>();
    this.searchForm = this.fb.group({
      name: [''],
      type: [''],
      rating: ['']
    });
  }

  ngOnInit() {
    if (this.adminId) {
      this.administrationService.getCompanyAdmin(this.adminId).subscribe({
        next: (user) => {
          this.admin = user;
          this.initializeForm();

          this.administrationService.getAllAdmins(this.admin.company.id).subscribe({
            next: (result) => {
              this.admins = result;
            }
          });

          this.loadEquipment();
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

      this.administrationService.updateCompanyAdmin(this.adminId, updatedData).subscribe({
        next: (updatedAdmin) => {
          console.log('User profile updated successfully:', updatedAdmin);
          this.admin = updatedAdmin;
          this.isEditableAdmin = false;
          this.initializeAdminForm();
          this.administrationService.getAllAdmins(this.admin.company.id).subscribe({
            next: (result) => {
              this.admins = result;
            }
          });
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

      this.administrationService.updateCompany(this.admin.company.id, updatedData).subscribe({
        next: (result) => {
          console.log('Company updated successfully:', result);
          this.admin.company = result;
          this.isEditableCompany = false;
          this.initializeCompanyForm();
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

  searchEquipment(): void {

    this.page = 0;
    this.name = this.searchForm.get('name')?.value;
    this.type = this.searchForm.get('type')?.value;
    this.rating = this.searchForm.get('rating')?.value;

    this.paginator.firstPage();
    this.loadEquipment();
  }

  onPageChange(event: PageEvent) {

    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadEquipment();
  }

  clearAll() {

    this.searchForm.reset();
    this.searchForm.get('type')?.setValue('');
    this.searchEquipment();
  }

  loadEquipment(): void {

    this.administrationService.getEquipment(this.admin.company.id).subscribe(result => {
      this.equipment = result;
    })
  }

  addNewEquipment() {
    console.log("Adding new equipment");
  }

  editEquipment(eq: Equipment) {
    console.log("Edit: " + eq.name);
  }

  deleteEquipment(eq: Equipment) {

    const index = this.equipment.indexOf(eq);

    if (index !== -1) {
      this.equipment.splice(index, 1);
      this.administrationService.updateEquipmentInCompany(this.admin.company.id, this.equipment).subscribe(result => {

        this.loadEquipment();
        console.log("Deleted: " + eq.name);
      });
    } else {
      console.log("Element not found in the list.");
    }
  }
}
