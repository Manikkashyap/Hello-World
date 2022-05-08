import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../Service/employee.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  dataSource: any;
  EmployeeForm: FormGroup;
  flights: any;
  totalRecords: number;
  label: any = '';
  modalHeading: string;
  filterOn: boolean = false;
  displayModal: boolean;
  displayAddModal: boolean;
  deleteId: any;
  EditId: any;
  submitted: boolean = false;
  departments: any = [{ label: 'BackEnd' }, { label: 'FrontEnd' }];
  constructor(private _emp: EmployeeService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeFormControls();
    this.getEmployeeList();
  }

  public initializeFormControls() {
    this.EmployeeForm = this.fb.group({
      full_name: ['', Validators.required],
      department: ['', Validators.required],
      salary: ['', Validators.required],
    })
  }

  get f() {
    return this.EmployeeForm.controls;
  }

  // get the data from backend
  private getEmployeeList() {
    this._emp.getEmployees().subscribe((res: any) => {
      if (res) {
        this.dataSource = res
        this.totalRecords = res.length;
      }
    })
  }

  onDepartmentChange(e) {
    this.filterOn = true;
    const FilteredDepartment = this.dataSource.filter(obj => {
      // Returns the object where
      // the given property has some value
      return obj.department === e.value.label
    })
    this.dataSource = FilteredDepartment;
  }

  filterReset() {
    this.filterOn = false;
    this.label = ''
    this.getEmployeeList();
  }

  showDeleteModalDialog(id) {
    this.displayModal = true;
    this.deleteId = id;
  }

  deleteEmployee() {
    this.displayModal = false;
    this._emp.deleteEmployee(this.deleteId).subscribe(res => {
      this.getEmployeeList()
    })
  }

  showEditModal(id) {
    this.modalHeading = 'Edit Employee Info'
    this.displayAddModal = true;
    this.EditId = id;
    const selectedEmployee = this.dataSource.find(obj => {
      // Returns the object where
      // the given property has some value
      return obj.id === this.EditId
    });
    this.EmployeeForm.patchValue({ full_name: selectedEmployee.full_name, salary: selectedEmployee.salary, department: selectedEmployee.department })
  }

  showAddModal() {
    if (this.EditId) {
      this.EditId = '';
    }
    this.submitted=false;
    this.EmployeeForm.reset();
    this.displayAddModal = true;
    this.modalHeading = 'Add New Employee'
  }

  onSubmit(e: any) {
    this.submitted = true;
    if (this.EmployeeForm.valid) {
      if (this.EditId) {
        this._emp.editEmployee(this.EditId, this.EmployeeForm.value).subscribe(res => {
          if (res) {
            this.displayAddModal = false;
            this.getEmployeeList();
            this.submitted = false;
          }
        })
      } else {
        this._emp.addEmployee(this.EmployeeForm.value).subscribe(res => {
          if (res) {
            this.displayAddModal = false;
            this.getEmployeeList()
          }
        })
      }
    }
  }


}
