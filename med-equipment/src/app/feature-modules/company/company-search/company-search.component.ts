import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/shared/model/company';
import { CompanyService } from '../company.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class CompanySearchComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'location', 'rating'];
  dataSource: MatTableDataSource<Company>;
  page: number = 0;
  size: number = 5;
  totalCompanies = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  city: string = '';
  rating: number = 0;
  sortField: string = 'name';
  sortDirection: string = 'asc'; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<Company>();
    this.searchForm = this.formBuilder.group({
      name: [''],
      city: [''],
      rating: ['']
    });
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadCompanies();
    });

    this.cdr.detectChanges();
    this.loadCompanies();
  }


  loadCompanies(): void {
    this.companyService.getCompanies(
      this.name,
      this.city,
      this.rating,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<Company>();
      this.dataSource.data = result.content;
      this.totalCompanies = result.totalElements;
    });
  }

  searchCompanies(): void {
    this.page = 0;
    this.name = this.searchForm.get('name')?.value;
    this.city = this.searchForm.get('city')?.value;
    this.rating = this.searchForm.get('rating')?.value;

    this.paginator.firstPage();
    this.loadCompanies();
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadCompanies();
  }

  onRowClick(company: Company): void {
    console.log(company)
    this.router.navigate(['company', company.id]);
  }

  clearAll() {
    this.searchForm.reset();
    this.searchCompanies();
  }
}