import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { Equipment } from '../../../shared/model/equipment';
import { Company } from 'src/app/shared/model/company';
import { AuthService } from 'src/app/authentication/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  //companies: Company[] = [];
  companies: MatTableDataSource<Company>;
  //selectedEquipment: Equipment;
  showList: boolean = false;
  userId?: number;
  userRole?: string;

  constructor(private service: MarketplaceService, authService: AuthService, private formBuilder: FormBuilder) {
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
    this.loadEquipment();
  }

  loadEquipment(): void {
    this.service.getEquipmentTemp(this.name, this.type, this.rating, this.page, this.size).subscribe(result => {
      this.dataSource = new MatTableDataSource<Equipment>();
      this.dataSource.data = result.content;
      this.totalEquipment = result.totalElements;
      //getuj i kompanije
    });
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
    console.log(equipment);
    //this.selectedEquipment = equipment;
    this.showList = true;

    this.service.getCompaniesByEquipment(equipment.id).subscribe({
      next: (result: Company[]) => {
        //this.companies = result;
        this.companies = new MatTableDataSource<Company>();
        this.companies.data = result;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  clearAll() {
    this.showList = false;
    this.searchForm.reset();
    this.searchForm.get('type')?.setValue('');
    this.searchEquipment();
  }

  // onShowCompanies(equipmentId: number): void {
  //   this.isShowingCompanies = true;
  //   this.service.getCompaniesByEquipment(equipmentId).subscribe({
  //     next: (result: Company[]) => {
  //       this.companies = result;
  //     },
  //     error: (err: any) => {
  //       console.log(err)
  //     }
  //   })
  // } sow za kompani admina i get eq fale

}
