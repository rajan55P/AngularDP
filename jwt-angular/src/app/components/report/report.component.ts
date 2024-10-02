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
  students: Student[] = []; // Adjusted to your Student model
  paginatedStudents: Student[] = [];
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

  constructor(
    private service: JwtService
  ) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.service.getAllStudentData().subscribe((data) => { 
      this.students = data;
      this.totalItems = this.students.length;
      this.paginatedStudents = this.students.slice(0, this.itemsPerPage);
    });
  }

  applyFilters() {
    // Check if there are any non-empty filters
    const hasFilters = this.filters.studentId || 
                      this.filters.className || 
                      this.filters.startScore || 
                      this.filters.endScore || 
                      this.filters.startDate || 
                      this.filters.endDate;

    const filteredStudents = this.students.filter(student => {
        const dob = new Date(student.dateOfBirth).getTime();
        const startDate = this.filters.startDate ? new Date(this.filters.startDate).getTime() : null; 
        const endDate = this.filters.endDate ? new Date(this.filters.endDate).getTime() : null;

        return (!this.filters.studentId || student.studentId === this.filters.studentId) &&
               (!this.filters.className || student.className.includes(this.filters.className)) && 
               (!this.filters.startScore || student.score >= this.filters.startScore) &&
               (!this.filters.endScore || student.score <= this.filters.endScore) &&
               (startDate === null || dob >= startDate) && 
               (endDate === null || dob <= endDate);
    });

    // If no filters are applied, return all students
    this.students = hasFilters ? filteredStudents : this.students;
}




  onPageChange(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    this.paginatedStudents = this.students.slice(startIndex, startIndex + this.itemsPerPage);
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.students);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_report.xlsx');
  }
}
