import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.component.html',
  styleUrls: ['./vehicle-registration.component.css']
})
export class VehicleRegistrationComponent implements OnInit {

    vehicleObj ={
    vehicleNo: '',
    eNo: '',
    surveyDate: '',
    riDate: '',
    location: ''
  }
locationList:any =[];
uploadMessage: string | null = null;
isError: boolean = false;

  constructor(private service:VehicleService, private router: Router) {
  }

  ngOnInit(): void {
    this.getLocation();
  }

    registrationForm = new FormGroup({
      vehicleNo: new FormControl('',[Validators.required]),
      eNo: new FormControl('',[]),
      surveyDate: new FormControl('',[Validators.required]),
      riDate: new FormControl('',[]),
      location: new FormControl('',[Validators.required]),
    });

     get f(){
    return this.registrationForm.controls;
  }

  getLocation(){
    this.service.getVehicleList().subscribe((res)=>{
        this.locationList = [...new Set(res.result.map((vehicle: any) => vehicle.location))];
        console.log(this.locationList);
    })
  }

  onSubmit() {
      if(this.registrationForm.invalid){
      console.log("registrationForm details are invalid");
    }else{
      this.service.addVehicle(this.registrationForm.value).subscribe((result)=>{
        // console.log(result)
        this.registrationForm.reset();
        this.router.navigate(['/homePage']);
      })
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.service.geExcelData(formData).subscribe({
        next: (res: any) => {
      this.uploadMessage = res.message;
      this.isError = false;
     
      setTimeout(()=>{
        this.uploadMessage = null;
        this.router.navigate(['/homePage']);
      },5000)
    },
    error: (err) => {
      this.uploadMessage = 'Upload failed: ' + (err.error?.error || 'Unknown error');
      this.isError = true;

      setTimeout(()=>{
        this.uploadMessage = null;
        this.router.navigate(['/homePage']);
      },5000)
    }
    })
  }
}
