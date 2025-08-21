import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private selectedLocationSource = new BehaviorSubject<string>('');
  selectedLocation$ = this.selectedLocationSource.asObservable();

  constructor(private http: HttpClient) {}

  getVehicleList() {
    let url =
      environment.Vehicle_base_url + environment.Vehicle.All_Vehicle_List;
    return this.http.get<{ result: any[] }>(url);
  }

  addVehicle(data: any) {
    let url = environment.Vehicle_base_url + environment.Vehicle.Add_Vehicle;
    return this.http.post(url, data);
  }

  getVehiclesByLocation(location: string, page: number, limit: number, search: string = '') {
    let url = environment.Vehicle_base_url + environment.Vehicle.Location;
    return this.http.get<any>(
      url + `?location=${location}&page=${page}&limit=${limit}&search=${search}`
    );
  }

  setLocation(location: string) {
    this.selectedLocationSource.next(location);
  }

  geExcelData(data: any) {
    let url = environment.Vehicle_base_url + environment.Vehicle.ExcelData;
    return this.http.post(url, data);
  }

  updateVehicle(id: string, data: any) {
    let url = environment.Vehicle_base_url + environment.Vehicle.Update_Vehicle;
    return this.http.put(url + `${id}`, data);
  }

  searchVehicle(term: any){
     let url = environment.Vehicle_base_url + environment.Vehicle.Search_Vehicle;
    return this.http.get(url + `?search=${term}`);
  }
}
