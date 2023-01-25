import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../models/employee.model';
import { DialogService } from '../services/dialog.service';
import { EmployeeService } from '../services/employee.service';
import { MessengerService } from '../services/messenger.service';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: any;
  employees : Employee[] = [];
  employeeList : any;
  employeeObs$: Observable<any> | undefined;
  excelData : any;

  constructor(private empService : EmployeeService, private dataService : MessengerService, private route : ActivatedRoute, private router : Router, private dialogService: DialogService, private toastr: ToastrService, private fileSaver : FileSaverService){

  }

  ngOnInit(): void { 
    this.setPagination();
    // this.getAllEmployee();
  }

  // getAllEmployee(){
  //   this.empService.getAllEmployee().subscribe((data:Employee[])=>{
  //     this.employees = data;
  //     this.router.navigate(['/employee-list'])

  //   })  
  // }

  editEmployee(editEmployeeData:Employee){
    this.dataService.setMessage(editEmployeeData);
    // console.log(editEmployeeData);
  }

  deleteEmployee(employee:Employee){
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.empService.deleteEmployee(employee.empId).subscribe(res=>{
          this.toastr.success("", 'Delete Employee Successful',{
            timeOut: 2000,
            positionClass: 'toast-bottom-center'
          })
          // this.getAllEmployee();
          this.setPagination();
        })
      }
    });
  }

  applyFilter(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value
    this.employeeList.filter = filterValue;
    
  }

  // searchEmployees(event: any) {
  //   let filteredEmployees: Employee[] = [];

  //   if (event === '') {
  //     this.getAllEmployee();
  //   } else {
  //     filteredEmployees = this.employees.filter((val : any, index) => {
  //       let targetKey = val.empId.toLowerCase();
  //       let targetName = val.Employee_Name.toLowerCase();
  //       let searchKey = event.toLowerCase();
  //       return targetKey.includes(searchKey) || targetName.includes(searchKey);
  //     });
  //     this.employees = filteredEmployees;
  //   }
  // }

  excelExport(){
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset= UTF-8';
    const EXCEL_EXTENSION = '.xlsx'

    const worksheet = XLSX.utils.json_to_sheet(this.employeeList.filteredData);

    const workbook = {
      Sheets:{
        'testingSheet' : worksheet
      },
      SheetNames : ['testingSheet']
    } 

    const excelBuffer = XLSX.write(workbook, {bookType:'xlsx', type : 'array'});
    const blobData = new Blob([excelBuffer],{type : EXCEL_TYPE});
    this.dialogService.openConfirmDialog('Do you want to download ?')
    .afterClosed().subscribe(res =>{
      if(res){
          this.fileSaver.save(blobData,"employee_list");
          this.toastr.success("", 'Download Successful',{
            timeOut: 2000,
            positionClass: 'toast-bottom-center'
          })
      }
    });
  }

  readExcel(event : any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) =>{
      var workBook = XLSX.read(fileReader.result, {type : 'binary'});
      var sheetNames = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      // console.log(this.excelData);      
    }
  }

  importExcel(){
    this.empService.importEmployee(this.excelData).subscribe(data=>{
      console.log(data);      
    });
    this.toastr.success("", 'Import Data Successful',{
      timeOut: 1000,
      positionClass: 'toast-bottom-center'
    });
    this.setPagination();
    this.fileInput.nativeElement.value = '';
  }

  setPagination() {
    this.empService.getAllEmployee().subscribe(data => {
      this.employees = data;

      this.employeeList = new MatTableDataSource<any>(this.employees);
      this.employeeList.paginator = this.paginator;
      this.employeeObs$ = this.employeeList.connect();
    })
  }

}
