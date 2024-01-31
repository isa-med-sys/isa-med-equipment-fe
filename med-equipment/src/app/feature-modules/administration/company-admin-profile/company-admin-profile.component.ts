import { Component, ViewChild } from '@angular/core';
import { CompanyAdmin } from "../../../shared/model/company-admin";
import { AuthService } from "../../../authentication/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdministrationService } from '../administration.service';
import { MatTableDataSource } from "@angular/material/table";
import { Equipment } from "../../../shared/model/equipment";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import {co, e} from "@fullcalendar/core/internal-common";
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

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
  equipmentForm!: FormGroup;
  errorMessage: string = '';
  admins: CompanyAdmin[] = [];

  // Equipment list
  displayedColumns: string[] = ['quantity', 'name', 'description', 'type', 'actions'];
  dataSource: MatTableDataSource<Equipment>;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  type: string = '';
  rating: number = 0;
  filteredEquipment: Equipment[] = [];

  equipment: Equipment[] = [];

  showAddForm: boolean = false;
  showEditForm: boolean = false;
  selectedEquipment!: Equipment;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private administrationService: AdministrationService, authService: AuthService, private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) {
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
    this.initializeEquipmentForm();
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

  initializeEquipmentForm() {
    this.equipmentForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      type: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
      quantity: ["", [Validators.required, Validators.min(0)]],
    })
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
      const address = this.companyForm.get('address')?.value;
    
      this.getLatLongFromAddressOpenCage(address.street + ' ' + address.streetNumber + ' ' + address.city + ' ' + address.country)
        .subscribe({
          next: (locationResult: any) => {
            if (locationResult && locationResult.results && locationResult.results.length > 0) {
              const location = locationResult.results[0].geometry;
              const latitude = location.lat;
              const longitude = location.lng;
    
              const updatedUserData = this.companyForm.value;
              updatedUserData.address.latitude = latitude;
              updatedUserData.address.longitude = longitude;
    
              this.administrationService.updateCompany(this.admin.company.id, updatedUserData).subscribe({
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

  // Equipment
  searchEquipment(): void {

    const nameFilter = this.searchForm.get('name')?.value?.toLowerCase();
    const typeFilter = this.searchForm.get('type')?.value;
    const ratingFilter = this.searchForm.get('rating')?.value;

    this.filteredEquipment = this.equipment.filter(equipment => {
      const matchesName = !nameFilter || equipment.name.toLowerCase().includes(nameFilter);
      const matchesType = !typeFilter || equipment.type === typeFilter;
      const matchesRating = !ratingFilter || equipment.rating >= ratingFilter;

      return matchesName && matchesType && matchesRating;
    });

    this.dataSource = new MatTableDataSource<Equipment>();
    this.dataSource.data = this.filteredEquipment;
  }

  onPageChange(event: PageEvent) {

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
      this.dataSource = new MatTableDataSource<Equipment>();
      this.dataSource.data = this.equipment;
      console.log("Loaded: ");
      console.log(this.equipment);
    })
  }

  addNewEquipment() {
    this.initializeEquipmentForm();
    this.showAddForm = true;
    this.showEditForm = false;
  }

  editEquipment(eq: Equipment) {
    this.selectedEquipment = eq;
    this.showAddForm = false;
    this.updateEquipmentForm(this.selectedEquipment);
    this.showEditForm = true;
  }

  deleteEquipment(eq: Equipment) {
    const index = this.equipment.indexOf(eq);

    if (index !== -1) {
      if (this.equipment.at(index)) {
        eq.remove = true;
        this.administrationService.updateEquipmentInCompany(this.admin.company.id, this.equipment).subscribe({
          next: result => {
            this.loadEquipment();
            console.log("Deleted: " + eq.name);
          },
          error: _ => {
            eq.remove = undefined;
            this.openSnackBar(`Can remove equipment because it's reserved!\n`, 'Close');
          }
        });
      } else {
        console.error('Equipment at index is undefined.');
      }
    } else {
      console.log("Element not found in the list.");
    }
  }

  onSubmitEq() {
    if (this.equipmentForm.valid) {
      console.log("Adding new equipment");

      let e : Equipment = {
        id: 0,
        name: this.equipmentForm.get('name')?.value,
        description: this.equipmentForm.get('description')?.value,
        type: this.equipmentForm.get('type')?.value,
        rating: 0,
        price: this.equipmentForm.get('price')?.value,
        quantity: this.equipmentForm.get('quantity')?.value,
        companies: []
      };

      this.administrationService.addEquipment(e).subscribe(result => {
        e = result;
        e.quantity = this.equipmentForm.get('quantity')?.value;
        this.equipment.push(e);
        console.log(this.equipment);

        this.administrationService.updateEquipmentInCompany(this.admin.company.id, this.equipment).subscribe(result => {

          this.loadEquipment();
          console.log(this.equipment);
          console.log("Equipment added.");
          this.showAddForm = false;
        });
      });
    }
  }

  onEditEq() {
    if (this.equipmentForm.valid) {
      const index = this.equipment.findIndex(e => e.id === this.selectedEquipment.id);

      if (index !== -1) {
        const updatedEquipment = [...this.equipment];

        updatedEquipment[index] = {
          ...updatedEquipment[index],
          name: this.equipmentForm.get('name')?.value,
          description: this.equipmentForm.get('description')?.value,
          type: this.equipmentForm.get('type')?.value,
          price: this.equipmentForm.get('price')?.value,
          quantity: this.equipmentForm.get('quantity')?.value,
        };

        this.equipment = updatedEquipment;

        console.log(this.equipment);

        this.administrationService.updateEquipment(this.equipment[index].id, this.equipment[index]).subscribe(result => {
          console.log(result);

          this.administrationService.updateEquipmentInCompany(this.admin.company.id, this.equipment).subscribe({
            next: (resutl) => {
              this.loadEquipment();
              console.log(this.equipment);
              console.log("Equipment updated.");
              this.showEditForm = false;
            },
            error: _ => {
              this.openSnackBar(`Can decrease quantity of equipment because it's reserved!\n`, 'Close');
            }
          });
        });
      }
    }
  }

  updateEquipmentForm(e: Equipment) {
    this.equipmentForm = this.fb.group({
      name: [e.name, Validators.required],
      description: [e.description, Validators.required],
      type: [e.type, Validators.required],
      price: [e.price, [Validators.required, Validators.min(0)]],
      quantity: [e.quantity, [Validators.required, Validators.min(0)]],
    });
  }

  discardForm() {
    this.showAddForm = false;
    this.showEditForm = false;
  }

  openSnackBar(message: string, action: string, verticalPosition: MatSnackBarVerticalPosition = 'bottom') {
    this.snackBar.open(message, action, {
      duration: 30000,
      verticalPosition: verticalPosition,
    });
  }

  private getLatLongFromAddressOpenCage(address: string) {
    const apiKey = '7087c471f8054150abf1cd6421ae2324';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=en&limit=1`;
  
    return this.http.get(apiUrl);
  }
}
