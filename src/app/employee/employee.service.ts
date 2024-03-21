import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from './employee.interface';
import {HttpClient} from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url:string = "http://localhost:3000/employees"
  constructor(private _httpClient:HttpClient) { }
  getEmployees():Observable<IEmployee[]> {
    return this._httpClient.get<IEmployee[]>(this.url)
  }
  getEmployee(id:number):Observable<IEmployee> {
    return this._httpClient.get<IEmployee>(`${this.url}/${id}`)
  }
  updateEmployee(employee:IEmployee):Observable<void> {
    return this._httpClient.put<void>(`${this.url}/${employee.id}`,employee)
  }
  addEmployee(employee:IEmployee):Observable<void> {
    return this._httpClient.post<void>(this.url,employee)
  }
}
