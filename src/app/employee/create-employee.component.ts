import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm:FormGroup
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['']
      })
    })
  }
  onSubmit() : void {
    console.log(this.employeeForm);
    
  }
  onLoadData() : void {
    this.employeeForm.patchValue({
      fullName:'Nexo',
      email: 'nexo@gmail.com',
      // skills:{
      //   skillName:'Developer',
      //   experienceInYears:5,
      //   proficiency:'beginner'
      // }
    })
  }
}
