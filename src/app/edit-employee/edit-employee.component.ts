import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../models/employee.model';
import { Leave } from '../models/leave.model';
import { EmployeeService } from '../services/employee.service';
import { MessengerService } from '../services/messenger.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit{
  dynamicArray: Array<any> = []; 
  newDynamic: any = {}; 
  addIndex: any=0;

  leaveShow : boolean = false;
  employees : Employee;
  id : any = "";
  selectedInterest : any = [];
  images: any;
  isHidden : boolean = false;
  leave_info  = [];

  url = "";
  imageUrl = "";
  date : any;
  employeeForm: FormGroup;
  imgShow : any = "";
  leavemaxDate : any;
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
  leaveOptions : any = [
    'Medical Leave',
    'Annual Leave',
    'Casual Leave',
  ]

  constructor(private fb: FormBuilder, private route : ActivatedRoute, private router: Router, private empService : EmployeeService, private dataService : MessengerService, private toastr: ToastrService){

    
      // for(let i=0; i < this.leave_info.length; i++){
      //   if(this.employees.empId == this.leave_info.empId){
      //     console.log(this.leave_info);          
      //   }
      // }
  }

  ngOnInit(): void {
    this.date = Date.now();
    // this.employeeForm = this.fb.group({
    //   empId: this.fb.control('',Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])),
    //   joinDate: this.fb.control(''),
    //   empName: this.fb.control('', [Validators.required]),
    //   dateofBirth: this.fb.control(''),
    //   rank: this.fb.control('default'),
    //   department: this.fb.control('default'),
    //   gender: this.fb.control(''),
    //   interest : new FormArray([]),
    //   phone: this.fb.control('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    //   email: this.fb.control('',[
    //     Validators.required,
    //     Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    //   address: this.fb.control(''),
    //   remark: this.fb.control(''),
    // });
    this.employeeForm = this.fb.group({
      empId: this.fb.control(''),
      joinDate: this.fb.control(''),
      empName: this.fb.control('',),
      dateofBirth: this.fb.control(''),
      rank: this.fb.control('default'),
      department: this.fb.control('default'),
      gender: this.fb.control(''),
      interest : new FormArray([]),
      phone: this.fb.control(''),
      email: this.fb.control(''),
      address: this.fb.control(''),
      remark: this.fb.control(''),
      leaveType : this.fb.control('default'),
      fromDate : this.fb.control(''),
      toDate : this.fb.control(''),
      days : this.fb.control(''),
      reason : this.fb.control(''),
    });

    this.dataService.selectedEmployee$.subscribe((data:Employee) => {
      this.employees = data;
      this.imageUrl = data.Image;
      // console.log(this.employees);
    });   
    
    this.empService.getAllLeave().subscribe((data:any)=>{   
      this.leave_info = data;
      this.leave_info.forEach((element:any) => {
        // console.log(element.empId);
        if(element.empId == this.employees.empId){
          this.dynamicArray.push({"Leave_Type" : element.Leave_Type, "From_Date" : element.From_Date, "To_Date" : element.To_Date, "Days" : element.Days, "Reason" : element.Reason});      
        }      
      });       
    })
    this.setForm();
  };
  

  onCheckboxChange(event: any) {    
    let index = this.selectedInterest.indexOf(event.target.value);
    if(index == -1){
      this.selectedInterest.push(event.target.value)
    }
    else{
      this.selectedInterest.splice(index, 1);
    }
    console.log(this.selectedInterest);
  }

  selectImage(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;

      var reader = new FileReader();
      this.isHidden =true;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any)=>{
        this.url = event.target.result;
      }
    }
  }

  updateEmployee() {
    this.id = this.route.snapshot.paramMap.get("id");
    if(this.images == null || this.images == undefined || this.images == ""){
      this.images = this.imageUrl;
    } 
    let formData = new FormData();
    formData.append('Image', this.images); 
    formData.append('empId', this.EmpId.value);
    formData.append('Joined_Date', this.JoinDate.value);
    formData.append('Employee_Name', this.EmpName.value);
    formData.append('Date_of_Birth', this.DateofBirth.value);
    formData.append('Ranking', this.rankOptions[parseInt(this.Rank.value)]);
    formData.append('Department', this.departmentOptions[parseInt(this.Department.value)]);
    formData.append('Gender', this.Gender.value);
    formData.append('Interest', this.selectedInterest.toString());
    formData.append('Phone', this.Phone.value);
    formData.append('Email', this.Email.value);
    formData.append('Address', this.Address.value);
    formData.append('Remark', this.Remark.value);
    formData.append ('Leave',  JSON.stringify(this.dynamicArray));
    // new Response(formData).text().then(console.log)
    if(this.employeeForm.valid){
      this.empService.updateEmployee(formData,this.id).subscribe((res:Employee)=>{
        this.employeeForm.reset();
        this.toastr.success("", 'Updated Employee Successful',{
          timeOut: 2000,
          positionClass: 'toast-bottom-center'
        })
        this.router.navigate(['/employee-list']);
      })
    }else{
      alert('please fill required field!')
    }
  }

  setForm(){
    this.EmpId.setValue(this.employees.empId);
    this.JoinDate.setValue(this.employees.Joined_Date);
    this.EmpName.setValue(this.employees.Employee_Name);
    this.DateofBirth.setValue(this.employees.Date_of_Birth);
    let rankIndex = 0;
    this.rankOptions.forEach((val, index) => {
      if (val === this.employees.Ranking) rankIndex = index;
    });
    this.Rank.setValue(rankIndex);

    let departmentIndex = 0;
    this.departmentOptions.forEach((val, index) => {
      if (val === this.employees.Department) departmentIndex = index;
    });
    this.Department.setValue(departmentIndex);
    this.Gender.setValue(this.employees.Gender);
    this.selectedInterest = this.employees.Interest.split(",");
    this.Phone.setValue(this.employees.Phone);
    this.Email.setValue(this.employees.Email);
    this.Address.setValue(this.employees.Address);
    this.Remark.setValue(this.employees.Remark);
    this.imgShow = this.employees.Image;
    this.url = this.employees.Image;
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
    console.log(numberofday)
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
    this.newDynamic =  {id: index,Leave_Type: "", From_Date: "",To_Date:"", Days : "", Reason : ""};  
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
}
