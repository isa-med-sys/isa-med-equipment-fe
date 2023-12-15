import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { Equipment } from '../../../shared/model/equipment';
import { Company } from 'src/app/shared/model/company';
import { AuthService } from 'src/app/authentication/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from '../../administration/administration.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'description', 'type', 'rating'];
  dataSource: MatTableDataSource<Equipment>;
  page: number = 0;
  size: number = 5;
  totalEquipment = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  type: string = '';
  rating: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  companies: MatTableDataSource<Company>;
  showList: boolean = false;
  userId!: number;
  userRole?: string;
  companyId?: number;

  constructor(private service: MarketplaceService, authService: AuthService, private administrationService: AdministrationService, private formBuilder: FormBuilder) {
    this.userId = authService.user$.value.id;
    this.userRole = authService.user$.value.role;

    this.dataSource = new MatTableDataSource<Equipment>();
    this.companies = new MatTableDataSource<Company>();
    this.searchForm = this.formBuilder.group({
      name: [''],
      type: [''],
      rating: ['']
    });
  }
  
  ngAfterViewInit(): void {
    if(this.userRole == 'COMPANY_ADMIN') {
      this.administrationService.getCompanyAdmin(this.userId).subscribe({
        next: (user) => {
          this.companyId = user.company.id;
          this.loadEquipment();
        },
        error: (err) => {
          console.error('Error fetching admin profile:', err);
        }
      });
    }
    else this.loadEquipment();
  }

  loadEquipment(): void {
    if(this.userRole != 'COMPANY_ADMIN') {
      this.service.getEquipmentTemp(this.name, this.type, this.rating, this.page, this.size).subscribe(result => {
        this.dataSource = new MatTableDataSource<Equipment>();
        this.dataSource.data = result.content;
        this.totalEquipment = result.totalElements;
      });
    }
    else if(this.companyId) {
      this.service.getEquipmentTempCa(this.name, this.type, this.rating, this.companyId, this.page, this.size).subscribe(result => {
        this.dataSource = new MatTableDataSource<Equipment>();
        this.dataSource.data = result.content;
        this.totalEquipment = result.totalElements;
      });
    }
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

  onRowClick(equipment: Equipment): void {
    if(this.userRole != 'COMPANY_ADMIN') {

      console.log(equipment);
      this.showList = true;
      
      this.service.getCompaniesByEquipment(equipment.id).subscribe({
        next: (result: Company[]) => {
          this.companies = new MatTableDataSource<Company>();
          this.companies.data = result;
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    }
  }

  clearAll() {
    this.showList = false;
    this.searchForm.reset();
    this.searchForm.get('type')?.setValue('');
    this.searchEquipment();
  }
}
