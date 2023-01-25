import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private base_Url = "http://localhost:3000/api"
  constructor(private http : HttpClient) { }

  getAllEmployee() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.base_Url}/employee`);
  }

  createEmployee(data:any){
    return this.http.post<any>(`${this.base_Url}/employee`, data);
  }

  importEmployee(data : any){
    return this.http.post<any>(`${this.base_Url}/employee/import`, data);
  }

  updateEmployee(data : any, id: String) {
    return this.http.patch<any>(`${this.base_Url}/employee/${id}`,data);
  }

  deleteEmployee(id : string){
    return this.http.delete(`${this.base_Url}/employee/${id}`);
  }

  getRankData(){
    return this.http.get(`${this.base_Url}/rank`);
  }

  getAllLeave(){
    return this.http.get(`${this.base_Url}/employee/leave`)
  }

  getDepartmentData(){
    return this.http.get(`${this.base_Url}/department`);
  }
}
