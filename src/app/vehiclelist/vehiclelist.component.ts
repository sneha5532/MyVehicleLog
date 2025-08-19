import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { VehicleResponse } from '../models/vehicle-response.model';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-vehiclelist',
  templateUrl: './vehiclelist.component.html',
  styleUrls: ['./vehiclelist.component.css']
})
export class VehiclelistComponent implements OnInit {
@ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

location = '';
ByLocationList: any[] = [];
surveyProgress: string | undefined;
sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';
isEditMode: boolean = false;
currentPage = 1;
totalPages = 0;
pageSize = 10;
searchText: any = '';

  constructor(private Service : VehicleService,private router : Router) {}

ngOnInit() {
   this.getLocation();
   this.LocationWiseList(1);
}

getLocation(){
 this.Service.selectedLocation$.subscribe(loc=>{
    this.location = loc;
  })
}
  
LocationWiseList(currentPage:any){
    const search = (this.searchText?.trim().toLowerCase() === 'pending') ? '' : this.searchText;
   this.Service.getVehiclesByLocation(this.location,currentPage,this.pageSize,search).subscribe((data)=>{
      let list = data.vehiclesLocationList;

    // Show only pending records when search text is entered
    if (this.searchText?.trim().toLowerCase() === 'pending') {
      list = list.filter((vehicle: any) => !vehicle.riDate);
    }

    this.ByLocationList = list;
      this.totalPages = data.totalPages;
    })
}


  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.LocationWiseList(this.currentPage);
  }

// nextPage() {
//   if (this.currentPage < this.totalPages) {
//     this.LocationWiseList(this.currentPage + 1);
//   }
// }

// prevPage() {
//   debugger
//   if (this.currentPage > 1) {
//     this.LocationWiseList(this.currentPage - 1);
//   }
// }

editRecord(vehicle:any){
  let data = vehicle;
  console.log("data",data)
   this.router.navigate(['/vehicle-update/:id']);
}

deleteRecord(){

}

sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.ByLocationList.sort((a: any, b: any) => {
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

  captureImage(){
      html2canvas(this.tableContainer.nativeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Download image
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'table.png';
      link.click();
    });
  }

}
