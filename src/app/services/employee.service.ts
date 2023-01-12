import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private base_Url = "http://localhost:3000/api"
  constructor(private http : HttpClient) { }

  getAllEmployee() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.base_Url}/employee`);
  }

  createEmployee(data:Employee){
    return this.http.post<Employee>(`${this.base_Url}/employee`, data);
  }

  deleteEmployee(id : number){
    return this.http.delete(`${this.base_Url}/employee/${id}`);
  }

  getRankData(){
    return this.http.get(`${this.base_Url}/rank`);
  }

  getDepartmentData(){
    return this.http.get(`${this.base_Url}/department`);
  }
}
