import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, TitleStrategy } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { Rank } from '../models/rank.model';
import { EmployeeService } from '../services/employee.service';
// import { Employee } from './models/employee.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  @ViewChild('fileInput') fileInput: ElementRef;
  dynamicArray: any = []; 
  newDynamic: any = {}; 
  addIndex: any=0;

  leaveShow : boolean = false;
  selectedInterest : any = [];
  url = ""
  date : any;
  employeeForm: FormGroup;
  images: any;
  isHidden : boolean = false;
  imageDisplayError: boolean = false;
  imageErrorMessage: string = ""
  // rankOptions : any = [];
  // departmentOptions : any = [];
  numberOfDays : any;
  leavemaxDate : any;
  
  // leaveOptions : any = [
  //   {ID : 0, TYPE : "Medical Leave"},
  //   {ID : 1, TYPE : "Annual Leave"},
  //   {ID : 2, TYPE : "Casual Leave"},
  // ]
  leaveOptions : any = [
    'Medical Leave',
    'Annual Leave',
    'Casual Leave',
  ]
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
  interests = [
    { name: 'Reading', value: 'reading' },
    { name: 'Listening', value: 'listening'},
    { name: 'Playing', value: 'playing'},
    { name: 'Singing', value: 'singing'}
  ];

  constructor(private fb: FormBuilder, private router: Router, private empService : EmployeeService, private toastr: ToastrService){
  }

  ngOnInit(): void {
    this.date = Date.now();
    this.employeeForm = this.fb.group({
      empId: this.fb.control('',Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])),
      joinDate: this.fb.control(''),
      empName: this.fb.control('', [Validators.required]),
      dateofBirth: this.fb.control(''),
      rank: this.fb.control('default', Validators.required),
      department: this.fb.control('default', Validators.required),
      gender: this.fb.control(''),
      interest : new FormArray([]),
      phone: this.fb.control('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      email: this.fb.control('',[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      address: this.fb.control(''),
      remark: this.fb.control(''),
      leaveType : this.fb.control('default'),
      fromDate : this.fb.control(''),
      toDate : this.fb.control(''),
      days : this.fb.control(''),
      reason : this.fb.control(''),
    });
    // this.employeeForm = this.fb.group({
    //   empId: this.fb.control(''),
    //   joinDate: this.fb.control(''),
    //   empName: this.fb.control('',),
    //   dateofBirth: this.fb.control(''),
    //   rank: this.fb.control('default'),
    //   department: this.fb.control('default'),
    //   gender: this.fb.control(''),
    //   interest : new FormArray([]),
    //   phone: this.fb.control(''),
    //   email: this.fb.control(''),
    //   address: this.fb.control(''),
    //   remark: this.fb.control(''),
    //   leaveType : this.fb.control('default'),
    //   fromDate : this.fb.control(''),
    //   toDate : this.fb.control(''),
    //   days : this.fb.control(''),
    //   reason : this.fb.control(''),
    // });

    this.empService.getRankData().subscribe((data:any)=>{   
      // this.rankOptions = data; 
    });

    this.empService.getDepartmentData().subscribe((data:any)=>{
      // this.departmentOptions = data; 
    });

    // for(let i=0; i< this.dynamicArray.length; i++){
    //   this.dynamicArray[i].Leave_Type = "default"
    // }
  }

   

  onCheckboxChange(event: any) {    
    let index = this.selectedInterest.indexOf(event.target.value);
    if(index == -1){
      this.selectedInterest.push(event.target.value)
    }
    else{
      this.selectedInterest.splice(index, 1);
    }
    // console.log(this.selectedInterest);
  }

  selectImage(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;

      var reader = new FileReader();
      this.isHidden = true;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.imageDisplayError = false;
      }
    }
  }

  addEmployee() {    
    // console.log(JSON.stringify(this.dynamicArray));
    // return
    let formData = new FormData();
    formData.append('Image', this.images); 
    formData.append('empId', this.EmpId.value);
    formData.append('Joined_Date', this.JoinDate.value);
    formData.append('Employee_Name', this.EmpName.value);
    formData.append('Date_of_Birth', this.DateofBirth.value);
    // formData.append('Ranking', this.rankOptions[parseInt(this.Rank.value)]["Ranking"]);
    // formData.append('Department', this.departmentOptions[parseInt(this.Department.value)]["Department"]);
    formData.append('Ranking', this.rankOptions[parseInt(this.Rank.value)]);
    formData.append('Department', this.departmentOptions[parseInt(this.Department.value)]);
    formData.append('Gender', this.Gender.value);
    formData.append('Interest', this.selectedInterest.toString());
    formData.append('Phone', this.Phone.value);
    formData.append('Email', this.Email.value);
    formData.append('Address', this.Address.value);
    formData.append('Remark', this.Remark.value);
    formData.append ('Leave',  JSON.stringify(this.dynamicArray));
    
    
    if(this.employeeForm.valid){      
      if(this.url == null || this.url == undefined || this.url == ""){
        this.imageDisplayError = true;
        this.imageErrorMessage = "Image is required!"
        this.toastr.error("", 'Please select a photo',{
          timeOut: 2000,
          positionClass: 'toast-bottom-center'
        })
        return;
      }
      this.empService.createEmployee(formData).subscribe((res:any)=>{
        console.log(res);
        if (res.success) {          
          this.employeeForm.reset();
          this.toastr.success("", 'Save New Employee Successful',{
            timeOut: 2000,
            positionClass: 'toast-bottom-center'
          })
          this.router.navigate(['/employee-list']);
        }else{     
          alert(res.message);
        }
      });
    }
  }

  browse(){
    this.router.navigate(['/employee-list']);
  }

  NumberOfDays(id: any, fromDate: any, toDate: any){
    const fromDateModified = new Date(fromDate);
    const toDateModified = new Date (toDate);
    
    // January 1, 1970
    const Time = toDateModified.getTime() - fromDateModified.getTime();
    let numberofday= Time / (1000 * 3600 * 24); 
    for(let i=0; i<this.dynamicArray.length; i++){
      if(this.dynamicArray[i].id  == id){
        this.dynamicArray[i].Days = numberofday;        
      }
    }   
    this.leavemaxDate = toDateModified;
    // this.leavemaxDate = toDateModified.setDate(toDateModified.getDate() + 1);    
  }

  addRow(index: any) {    
    this.leaveShow = true;  
    this.newDynamic =  {id: index,Leave_Type: "default", From_Date: "",To_Date:"", Days : "", Reason : ""};  
    this.addIndex= index+1;
    this.dynamicArray.push(this.newDynamic);
    // console.log(this.dynamicArray); 
  }

  deleteRow(index : any) {   
        this.dynamicArray.splice(index, 1);   
  }



  showLeave(){
    this.leaveShow = !this.leaveShow;
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
  public get LeaveType(): FormControl {
    return this.employeeForm.get('leaveType') as FormControl;
  }
  public get FromDate(): FormControl {
    return this.employeeForm.get('fromDate') as FormControl;
  }
  public get ToDate(): FormControl {
    return this.employeeForm.get('toDate') as FormControl;
  }
  public get getDays(): FormControl {
    return this.employeeForm.get('days') as FormControl;
  }
  public get Reason(): FormControl {
    return this.employeeForm.get('reason') as FormControl;
  }
}
