import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclelistComponent } from './vehiclelist/vehiclelist.component';
import { HomepageComponent } from './common/homepage/homepage.component';
import { VehicleRegistrationComponent } from './vehicle-registration/vehicle-registration.component';

const routes: Routes = [
  {path: '' , redirectTo: 'homePage', pathMatch: 'full'},
  {path: 'homePage', component: HomepageComponent},
  {path: 'vehicleRegstration', component: VehicleRegistrationComponent},
  {path: 'vehicleList', component: VehiclelistComponent},
  {path: 'vehicleList/:id', component: VehiclelistComponent}
  // {path: '404', component: PageNotfoundComponent},
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
