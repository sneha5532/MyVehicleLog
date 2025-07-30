import { Component, Input, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  locations:any;

  constructor(private Service : VehicleService,private router: Router) {}

  ngOnInit() {
    this.Service.getVehicleList().subscribe((data) => {
         this.locations = [...new Set(data.result.map((vehicle: any) => vehicle.location))];
         console.log(this.locations)
    });
  }

   selectLocation(location: string) {
    this.Service.setLocation(location);
    this.router.navigate(['/vehicleList']);
  }
}
