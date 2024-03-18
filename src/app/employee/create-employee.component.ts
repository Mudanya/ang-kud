import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm:FormGroup
  constructor(private fb:FormBuilder) { }
  validationMessages = {
    fullName:{
      required: 'Full Name is required!',
      minlength: 'Full Name should be greater than 2',
      maxlength: 'Full Name should be less than 10',
    },
    email:{
      required: 'Email is required'
    },
    skillName:{
      required: 'Skill is required'
    },
    experienceInYears:{
      required: 'Experience is required'
    },
    proficiency:{
      required: 'Proficiency is required'
    },
    phone:{
      required: 'Phone is required'
    },

  }

  formErrors = {
    fullName:'',
    email: '',
    skillName: '',
    experienceInYears: '',
    proficiency: '',
    phone:''

  }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(10)]],
      email: ['',Validators.required],
      phone: [''],
      contactPreference: ['email'],
      skills: this.fb.group({
        skillName: ['',Validators.required],
        experienceInYears: ['',Validators.required],
        proficiency: ['',Validators.required]
      })
    })

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data:string) => {
      debugger
      this.validatePhone(data)
    })

    this.employeeForm.valueChanges.subscribe(
      data => this.logValidationErrors(this.employeeForm)
      )
  } 
  onSubmit() : void {
    console.log(this.employeeForm);
    
  }
  validatePhone(selectedValue:string) {
    debugger
    const phone = this.employeeForm.get('phone')
    const email = this.employeeForm.get('email')
    if(selectedValue == 'phone') {
      email.clearValidators()
      phone.setValidators(Validators.required)
      phone.updateValueAndValidity()
    }
    else {
      phone.clearValidators()
      email.setValidators(Validators.required)
    }
    phone.updateValueAndValidity()
  }
  logValidationErrors(group: FormGroup = this.employeeForm) : void {
    Object.keys(group.controls).forEach((key:string) => 
    {
      const abstractControl  =  group.get(key)
      if(abstractControl instanceof FormGroup)
      {
        this.logValidationErrors(abstractControl)
      }
      else {
          this.formErrors[key] = ''
          if(abstractControl && !abstractControl.valid && (abstractControl.dirty || abstractControl.touched))
          {
            const messages = this.validationMessages[key]
            const errors = abstractControl.errors
            if(errors)
            {
              for(const errorKey in errors)
              {
                this.formErrors[key] += messages[errorKey] + ' '
              }
            }
          }
      }
    })
  }
  onLoadData() : void {
    
  }
}
