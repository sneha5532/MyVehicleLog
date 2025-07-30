import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
    private selectedLocationSource = new BehaviorSubject<string>('');
    selectedLocation$ = this.selectedLocationSource.asObservable();

 constructor(private http:HttpClient) { }

  getVehicleList(){
    let url = environment.Vehicle_base_url + environment.Vehicle.All_Vehicle_List;
    return this.http.get<{ result: any[] }>(url)
  }

  addVehicle(data:any){
    let url = environment.Vehicle_base_url + environment.Vehicle.Add_Vehicle;
      return this.http.post(url,data)
  }

getVehiclesByLocation(location: string) {
   let url = environment.Vehicle_base_url + environment.Vehicle.Location;
  return this.http.get<{vehiclesLocationList:any[]}>(url+`?location=${location}`);
}

  setLocation(location: string) {
    this.selectedLocationSource.next(location);
  }

  geExcelData(data:any){
     let url = environment.Vehicle_base_url + environment.Vehicle.ExcelData;
     return this.http.post(url,data);
  }

}
