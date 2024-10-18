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
  itemsPerPage: number = 100; // Set number of items per page to 100
  currentPage: number = 1;

  constructor(private service: JwtService) {}

  ngOnInit() {
    this.loadStudents();
  }

  

  async loadStudents() {
    try {
      const queryParams: any = {
        page: this.currentPage - 1,
        size: this.itemsPerPage
      };
  
      // Add only non-null and non-empty filter values
      if (this.filters.studentId) {
        queryParams.studentId = this.filters.studentId;
      }
      if (this.filters.className) {
        queryParams.className = this.filters.className;
      }
      if (this.filters.startScore !== null) {
        queryParams.startScore = this.filters.startScore;
      }
      if (this.filters.endScore !== null) {
        queryParams.endScore = this.filters.endScore;
      }
      if (this.filters.startDate) {
        queryParams.startDate = this.filters.startDate;
      }
      if (this.filters.endDate) {
        queryParams.endDate = this.filters.endDate;
      }
  
      const data = await this.service.getPaginatedStudentData(queryParams).toPromise();
      console.log('Fetched data:', data); // Debugging log

      // this.students = data.content;
      this.totalItems = data.totalElements;
      this.filteredStudents = data.content; // Set filteredStudents
      this.updatePaginatedStudents(); // Update paginated students
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }
  

  applyFilters() {
    // Prepare query parameters for pagination and filters
    const queryParams: any = {
      page: 0, // Reset to the first page
      size: this.itemsPerPage
    };
  
    // Add only non-null and non-empty filter values
    if (this.filters.studentId) {
      queryParams.studentId = this.filters.studentId;
    }
    if (this.filters.className) {
      queryParams.className = this.filters.className;
    }
    if (this.filters.startScore !== null) {
      queryParams.startScore = this.filters.startScore;
    }
    if (this.filters.endScore !== null) {
      queryParams.endScore = this.filters.endScore;
    }
    if (this.filters.startDate) {
      queryParams.startDate = this.filters.startDate;
    }
    if (this.filters.endDate) {
      queryParams.endDate = this.filters.endDate;
    }
  
    // Fetch filtered students from the server
    this.service.getPaginatedStudentData(queryParams).subscribe(
      data => {
        this.filteredStudents = data.content;
        this.totalItems = data.totalElements; // Update total items based on filtered results
        this.currentPage = 1; // Reset to first page
        this.updatePaginatedStudents();
      },
      error => {
        console.error('Error applying filters:', error);
      }
    );
  }
  

  resetFilters() {
    this.filters = {
      studentId: null,
      className: '',
      startScore: null,
      endScore: null,
      startDate: null,
      endDate: null
    };
    this.loadStudents(); // Reload students without filters
  }

  updatePaginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStudents = this.filteredStudents;
  }

  onPageChange(page: number) {
    console.log('Page changed to:', page);
    this.currentPage = page;
    this.loadStudents(); // Fetch new paginated data from the server
  }
  
  

  exportToExcel() {
    // Fetch all student data without pagination for export
    this.service.getAllFilteredStudentData(this.filters).subscribe(data => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, 'students_report.xlsx');
    }, error => {
      console.error('Error exporting to Excel:', error);
    });
  }
}
