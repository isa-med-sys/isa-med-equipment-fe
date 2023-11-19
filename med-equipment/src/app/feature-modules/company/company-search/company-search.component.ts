import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/shared/model/company';
import { CompanyService } from '../company.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private companyService: CompanyService, private router: Router, private formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource<Company>();
    this.searchForm = this.formBuilder.group({
      name: [''],
      city: [''],
      rating: ['']
    });
  }

  ngAfterViewInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getCompanies(this.name, this.city, this.rating, this.page, this.size).subscribe(result => {
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
