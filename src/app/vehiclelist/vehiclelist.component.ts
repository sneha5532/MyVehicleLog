import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { VehicleResponse } from '../models/vehicle-response.model';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-vehiclelist',
  templateUrl: './vehiclelist.component.html',
  styleUrls: ['./vehiclelist.component.css'],
})
export class VehiclelistComponent implements OnInit {
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  location = '';
  VehicleLists: any[] = [];
  getAllVehicleList: any[] = [];
  surveyProgress: string | undefined;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isEditMode: boolean = false;
  currentPage = 1;
  totalPages: number | undefined = 0;
  pageSize = 10;
  searchText: any = '';

  constructor(private Service: VehicleService, private router: Router) {}

  ngOnInit() {
    this.getLocation();
    if (this.location) {
      this.LocationWiseList(1);
    } else {
      this.AllVehicleList(1);
    }
  }

  getLocation() {
    this.Service.selectedLocation$.subscribe((loc) => {
      this.location = loc;
      localStorage.setItem('vehicleData', JSON.stringify(this.location));
    });
  }

  onSearch() {
    if (this.location) {
      this.LocationWiseList(1);
    } else {
      this.AllVehicleList(1);
    }
  }

  LocationWiseList(currentPage: any) {
    this.Service.getVehiclesByLocation(
      this.location,
      currentPage,
      this.pageSize,
      this.searchText
    ).subscribe((data) => {
      let list = data.vehiclesLocationList;

      // Show only pending records when search text is entered
      if (this.searchText?.trim().toLowerCase() === 'pending') {
        list = list.filter(
          (vehicle: any) => vehicle.status?.toLowerCase() === 'pending'
        );
      }

      this.VehicleLists = list;
      this.totalPages = data.totalPages;
    });
  }

  AllVehicleList(currentPage: any) {
    this.Service.getAllVehicleList(
      currentPage,
      this.pageSize,
      this.searchText
    ).subscribe((data: VehicleResponse) => {
         let list = data.result;
      if (this.searchText?.trim().toLowerCase() === 'pending') {
        list = list.filter(
          (vehicle: any) => vehicle.status?.toLowerCase() === 'pending'
        );
      }
       this.VehicleLists = list;
      this.totalPages = data.totalPages;
    });
  }

  changePage(page: number) {
    if (page < 1 || page > (this.totalPages ?? 0)) return;
    this.currentPage = page;
    if (this.location) {
      this.LocationWiseList(this.currentPage);
    } else {
      this.AllVehicleList(this.currentPage);
    }
  }

  editRecord(vehicle: any) {
    this.router.navigate(['/vehicle-update', vehicle._id]);
        console.log('data',  vehicle._id);
  }

  deleteRecord(vehicle:any) {
    debugger
   this.Service.deleteVehicle(vehicle._id).subscribe((res) => {
    const savedData = localStorage.getItem('vehicleData');
    console.log('savedData', savedData);
    debugger
      if (savedData && savedData !== '""') {
        this.LocationWiseList(1);
      } else {
        this.AllVehicleList(1);
      }
   });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.VehicleLists.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Convert to lowercase for strings
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  captureImage() {
    html2canvas(this.tableContainer.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Download image
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'table.png';
      link.click();
    });
  }

  ngOnDestroy(): void {
  localStorage.removeItem('vehicleData');
}
}
