import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "../shared/custom.validators";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from "./employee.service";
import { IEmployee, ISkill } from "./employee.interface";

@Component({
  selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.css"],
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee:IEmployee = {
    id:null,
    fullName:'',
    phone:'',
    email:'',
    contactPreference:'',
    skills:[]
  }
  pageTitle:string = 'Create'
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private employeeService:EmployeeService,
    private router:Router
    ) {}
  validationMessages = {
    fullName: {
      required: "Full Name is required!",
      minlength: "Full Name should be greater than 2",
      maxlength: "Full Name should be less than 10",
    },
    confirmEmail: {
      required: "Confirm Email is required",
    },
    emailGroup: {
      mailMismatch: "Confirm Email mismatch",
    },
    email: {
      required: "Email is required",
      emailDomain: "Wrong Domain nexo.com is required",
    },
    phone: {
      required: "Phone is required",
    },
  };

  formErrors = {
    
  };

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      emailGroup: this.fb.group({
        email: [
          "",
          [Validators.required, CustomValidators.emailDomain("nexo.com")],
        ],
        confirmEmail: [
          "",
          Validators.required,
        ],
      },{validators:mailMismatch}),
      phone: [""],
      contactPreference: ["email"],
      skills: this.fb.array([this.addSkillsGroup()]),
    });

    this.employeeForm
      .get("contactPreference")
      .valueChanges.subscribe((data: string) => {
        this.validatePhone(data);
      });

    this.employeeForm.valueChanges.subscribe((data) =>
      {
          this.logValidationErrors(this.employeeForm);
      }
    );
    this.activatedRoute.paramMap.subscribe(params => {
      const empId = +params.get('id')
      if(empId) {
        this.getEmployee(empId)
        this.pageTitle = 'Edit'
      }
      
    })
  }
  getEmployee(empId: number) {
    const employee = this.employeeService.getEmployee(empId).subscribe(data => {
      {
        this.editEmployee(data)
        this.employee = data
      }
    }, err => console.log(err))
  }
  editEmployee(data: IEmployee) {
    this.employeeForm.patchValue({
      fullName: data.fullName,
      emailGroup: { confirmEmail: data.email, email: data.email },
      contactPreference: data.contactPreference,
      phone: data.phone,
    });
    this.employeeForm.setControl('skills',this.skillsAdd(data.skills))
  }
  skillsAdd(skills:ISkill[]): FormArray {
    let skillsFormArray = new FormArray([]);
    skills.forEach(skill => {
      skillsFormArray.push(this.fb.group({
        skillName:skill.skillName,
        proficiency:skill.proficiency,
        experienceInYears:skill.experienceInYears
      }))
    })
    return skillsFormArray;
  }
  addSkillBtnClick():void {
    const skills = this.employeeForm.get('skills') as FormArray
    skills.push(this.addSkillsGroup())
  }
  onSubmit(): void {
    this.MapEmployeeDets()
    if(this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(res => {
        this.router.navigate(['employees'])
      }, err => console.log(err))
  }
  else {
    this.employeeService.addEmployee(this.employee).subscribe(res =>{
      this.router.navigate(['employees'])
    },err => console.log(err))
  }
  }
  MapEmployeeDets() {
    this.employee.fullName = this.employeeForm.get('fullName').value
    this.employee.email = this.employeeForm.get('emailGroup').value.email
    this.employee.contactPreference = this.employeeForm.get('contactPreference').value
    this.employee.phone = this.employeeForm.get('phone').value
    this.employee.skills = this.employeeForm.get('skills').value

  }
  addSkillsGroup():FormGroup {
    return this.fb.group({
      skillName: ["", Validators.required],
      experienceInYears: ["", Validators.required],
      proficiency: ["", Validators.required],
    })
  }
  validatePhone(selectedValue: string) {
    const phone = this.employeeForm.get("phone");
    const email = this.employeeForm.get("email");
    if (selectedValue === "phone") {
      email.clearValidators();
      phone.setValidators(Validators.required);
      phone.updateValueAndValidity();
    } else {
      phone.clearValidators();
      email.setValidators(Validators.required);
    }
    phone.updateValueAndValidity();
  }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = "";
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.dirty || abstractControl.touched || abstractControl.value !== '')
      ) {
        const messages = this.validationMessages[key];
        const errors = abstractControl.errors;
        if (errors) {
          for (const errorKey in errors) {
            this.formErrors[key] += messages[errorKey] + " ";
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
     
    });
  }
  onLoadData(): void {}
  removeSkill(skillIndex:number):void{
    const skills = (this.employeeForm.get('skills') as FormArray);
    skills.removeAt(skillIndex)
    skills.markAsDirty()
    skills.markAsTouched()
  }
}

function mailMismatch(group: AbstractControl): { [key: string]: any } | null {
  const email = group.get('email')
  const confirmEmail = group.get('confirmEmail')
  if(email.value === confirmEmail.value || confirmEmail.pristine) return null
  else return {'mailMismatch':true}
}
