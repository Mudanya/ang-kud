import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListEmployeesComponent } from "./list-employees.component";
import { CreateEmployeeComponent } from "./create-employee.component";

const employeeRoutes:Routes = [
    {path:'',component:ListEmployeesComponent},
    {path:'create',component:CreateEmployeeComponent},
    {path:'edit/:id',component:CreateEmployeeComponent},
]
@NgModule({
    imports:[
        RouterModule.forChild(employeeRoutes)
    ],
    exports:[RouterModule]
})
export class EmployeeRoutingModule {}