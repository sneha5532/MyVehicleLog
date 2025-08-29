import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { VehicleService } from '../services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.component.html',
  styleUrls: ['./vehicle-registration.component.css'],
})
export class VehicleRegistrationComponent implements OnInit {
  vehicleObj = {
    vehicleNo: '',
    eNo: '',
    surveyDate: '',
    riDate: '',
    status: '',
    location: '',
  };
  locationList: any = [];
  uploadMessage: string | null = null;
  isError: boolean = false;
  isEdit = false;
  statusList: any = ['completed', 'pending'];
  id: number | any;

  constructor(
    private service: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.loadVehicle(this.id);
    }
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const d = new Date(dateString);
    // pad month/day with leading zero
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  loadVehicle(id: string) {
    this.service.getVehicleList().subscribe((res: any) => {
      const vehicle = res.result.find((v: any) => v._id === id);
      if (vehicle) {
        this.registrationForm.patchValue({
          ...vehicle,
          surveyDate: this.formatDate(vehicle.surveyDate),
          riDate: this.formatDate(vehicle.riDate),
        });
      }
    });
  }

  registrationForm = new FormGroup({
    vehicleNo: new FormControl('', [Validators.required]),
    eNo: new FormControl('', []),
    surveyDate: new FormControl('', [Validators.required]),
    riDate: new FormControl('', []),
    status: new FormControl('', []),
    location: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.registrationForm.controls;
  }

  getLocation() {
    this.service.getVehicleList().subscribe((res) => {
      this.locationList = [
        ...new Set(res.result.map((vehicle: any) => vehicle.location)),
      ];
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.service
        .updateVehicle(this.id, this.registrationForm.value)
        .subscribe((result) => {
          this.registrationForm.reset();
          this.router.navigate(['/homePage']);
        });
    } else {
      this.service
        .addVehicle(this.registrationForm.value)
        .subscribe((result) => {
          this.registrationForm.reset();
          this.router.navigate(['/homePage']);
        });
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

        setTimeout(() => {
          this.uploadMessage = null;
          this.router.navigate(['/homePage']);
        }, 5000);
      },
      error: (err) => {
        this.uploadMessage =
          'Upload failed: ' + (err.error?.error || 'Unknown error');
        this.isError = true;

        setTimeout(() => {
          this.uploadMessage = null;
          this.router.navigate(['/homePage']);
        }, 5000);
      },
    });
  }
}
