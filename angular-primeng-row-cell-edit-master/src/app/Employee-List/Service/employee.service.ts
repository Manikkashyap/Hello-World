import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class EmployeeService {

  private employees = 'posts'
  constructor( private http: HttpClient ) { }

  // Get Employees List
  getEmployees(){
    return this.http.get(environment.apiUrl+this.employees)
  }

  // Delete Employee
  deleteEmployee(id){
    return this.http.delete(environment.apiUrl + this.employees + '/'+ id)
  }

  // Edit Employee
  editEmployee(id,payload){
    return this.http.put(environment.apiUrl + this.employees + '/' + id,payload)
  }

  // Add New Employee
  addEmployee(postData){
   return this.http.post(environment.apiUrl + this.employees , postData)
  }
}
