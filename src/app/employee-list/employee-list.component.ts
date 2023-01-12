import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit{
  // displayedColumns: string[] = ['position', 'joindate', 'name', 'dob','rank','department','gender','interest','phone','email','address','remark'];
  // dataSource : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  employees : Employee[] = [];

  constructor(private empService : EmployeeService){

  }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  getAllEmployee(){
    this.empService.getAllEmployee().subscribe((data:Employee[])=>{
      this.employees = data;
      // console.log(data);
      // this.dataSource = data;
    })  
  }

  deleteEmployee(employee:Employee){
    this.empService.deleteEmployee(employee.empId).subscribe(res=>{
      alert("Delete Employee Successful");
      this.getAllEmployee();
    })
  }
}
