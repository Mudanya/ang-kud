import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from './employee.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees:IEmployee[]
  constructor(
    private _employeeSvc:EmployeeService,
    private _router:Router
    ) { }

  ngOnInit() {
    this._employeeSvc.getEmployees().subscribe(data => this.employees =data,err => console.log(err))
  }
  editBtnClick(id:number):void {
    this._router.navigate(['employees/edit/',id])
  }

}
