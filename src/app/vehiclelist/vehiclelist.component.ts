import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-vehiclelist',
  templateUrl: './vehiclelist.component.html',
  styleUrls: ['./vehiclelist.component.css']
})
export class VehiclelistComponent implements OnInit {
location = '';
ByLocationList: any;
surveyProgress: string | undefined;

  constructor(private Service : VehicleService) {}

ngOnInit() {
  this.Service.selectedLocation$.subscribe(loc=>{
    this.location = loc;
  })
   this.LocationWiseList();
}
  
LocationWiseList(){
   this.Service.getVehiclesByLocation(this.location).subscribe((data)=>{
      this.ByLocationList = data.vehiclesLocationList;
    })
}

editRecord(){

}
deleteRecord(){

}

}
