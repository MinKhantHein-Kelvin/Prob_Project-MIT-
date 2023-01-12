import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
// import { Employee } from './models/employee.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  date : any;
  employeeForm: FormGroup;
  rankOptions = [
    'Manager',
    'Senior',
    'Junior',
    'Intern',
  ];
  departmentOptions = [
    'Sales',
    'HR',
    'SDD',
    'Network',
  ];
  interests: Array<any> = [
    { name: 'Reading', value: 'reading' },
    { name: 'Listening', value: 'listening' },
    { name: 'Playing', value: 'playing' },
    { name: 'Singing', value: 'singing' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private empService : EmployeeService){
  }

  ngOnInit(): void {
    this.date = Date.now();
    this.employeeForm = this.fb.group({
      empId: this.fb.control('',Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])),
      joinDate: this.fb.control(''),
      empName: this.fb.control('', [Validators.required]),
      dateofBirth: this.fb.control(''),
      rank: this.fb.control('default'),
      department: this.fb.control('default'),
      gender: this.fb.control(''),
      interest : new FormArray([]),
      phone: this.fb.control('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      email: this.fb.control('',[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      address: this.fb.control(''),
      remark: this.fb.control(''),
    });

    this.empService.getRankData().subscribe((data:any)=>{
      console.log(data);    
    });

    this.empService.getDepartmentData().subscribe((data:any)=>{
      console.log(data);  
    })
  }

  onCheckboxChange(event: any) {
    
    const interest = (this.employeeForm.controls['interest'] as FormArray);
    if (event.target.checked) {
      interest.push(new FormControl(event.target.value));
    } else {
      const index = interest.controls
      .findIndex(x => x.value === event.target.value);
      interest.removeAt(index);
    }
  }

  addEmployee() {
    let employee: Employee = {
      empId : this.EmpId.value,
      Joined_Date: this.JoinDate.value,
      Employee_Name: this.EmpName.value,
      Date_of_Birth: this.DateofBirth.value,
      Ranking: this.rankOptions[parseInt(this.Rank.value)],
      Department: this.departmentOptions[parseInt(this.Department.value)],
      Gender: this.Gender.value,
      Interest: this.Interest.value,
      Phone: this.Phone.value,
      Email : this.Email.value,
      Address: this.Address.value,
      Remark: this.Remark.value
    };
    if(this.employeeForm.valid){
      this.empService.createEmployee(employee).subscribe((res)=>{
        this.employeeForm.reset();
        this.router.navigate(['/employee-list']);
      })
      // console.log(employee);
      // this.employeeForm.reset();
    }else{
      alert('please fill required field!')
    }
  }

  browse(){
    this.router.navigate(['/employee-list']);
  }

  public get EmpId(): FormControl {
    return this.employeeForm.get('empId') as FormControl;
  }
  public get JoinDate(): FormControl {
    return this.employeeForm.get('joinDate') as FormControl;
  }
  public get EmpName(): FormControl {
    return this.employeeForm.get('empName') as FormControl;
  }
  public get DateofBirth(): FormControl {
    return this.employeeForm.get('dateofBirth') as FormControl;
  }
  public get Rank(): FormControl {
    return this.employeeForm.get('rank') as FormControl;
  }
  public get Department(): FormControl {
    return this.employeeForm.get('department') as FormControl;
  }
  public get Gender(): FormControl {
    return this.employeeForm.get('gender') as FormControl;
  }
  public get Phone(): FormControl {
    return this.employeeForm.get('phone') as FormControl;
  }
  public get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }
  public get Address(): FormControl {
    return this.employeeForm.get('address') as FormControl;
  }
  public get Remark(): FormControl {
    return this.employeeForm.get('remark') as FormControl;
  }
  public get Interest(): FormControl {
    return this.employeeForm.get('interest') as FormControl;
  }

}
