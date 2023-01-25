import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path : '', component : HomeComponent},
  {path : 'employee-list', component : EmployeeListComponent},
  {path : 'search/:searchItem', component : EmployeeListComponent},
  {path : ':id', component : EditEmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
