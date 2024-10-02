import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Student } from '../../models/student.model';
import { JwtService } from '../../service/jwt.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  students: Student[] = [];
  paginatedStudents: Student[] = [];
  filteredStudents: Student[] = []; 
  filters = {
    studentId: null,
    className: '',
    startScore: null,
    endScore: null,
    startDate: null,
    endDate: null
  };
  totalItems: number = 0;
  itemsPerPage: number = 10; // Set number of items per page
  currentPage: number = 1;

  constructor(private service: JwtService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.service.getAllStudentData().subscribe((data) => { 
      this.students = data;
      this.filteredStudents = data; // Initialize filteredStudents with all students
      this.totalItems = this.students.length;
      this.updatePaginatedStudents(); // Update paginated students initially
    });
  }

  applyFilters() {
    this.filteredStudents = this.students.filter(student => {
        const dob = new Date(student.dateOfBirth).getTime();
        const startDate = this.filters.startDate ? new Date(this.filters.startDate).getTime() : null; 
        const endDate = this.filters.endDate ? new Date(this.filters.endDate).getTime() : null;

        const classFilter = this.filters.className ? student.className.includes(this.filters.className) : true;

        return (!this.filters.studentId || student.studentId === this.filters.studentId) &&
               (classFilter) &&
               (!this.filters.startScore || student.score >= this.filters.startScore) &&
               (!this.filters.endScore || student.score <= this.filters.endScore) &&
               (startDate === null || dob >= startDate) && 
               (endDate === null || dob <= endDate);
    });

    this.totalItems = this.filteredStudents.length; // Update total items based on filtered results
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedStudents(); // Call method to update paginated results
}




  resetFilters() {
    this.filters = {
      studentId: null,
      className: '',
      startScore: null,
      endScore: null,
      startDate: null,
      endDate: null,
    };
    this.filteredStudents = this.students; // Reset to all students
    this.totalItems = this.students.length; // Update total items
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedStudents(); // Update paginated students
  }

  updatePaginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedStudents(); // Update paginated students on page change
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.students);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_report.xlsx');
  }
}
