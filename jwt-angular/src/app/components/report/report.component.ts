import { Component, OnInit } from '@angular/core';
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
    this.loadStudents(); // Load initial data on component initialization
  }

  async loadStudents() {
    try {
      const queryParams: any = {
        page: this.currentPage - 1, // Adjust for zero-based index
        size: this.itemsPerPage
      };

      // Add filters to the query params only if they are not null or empty
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

      this.filteredStudents = data.content; // Set filteredStudents
      this.totalItems = data.totalElements; // Total number of items returned from the server
      this.updatePaginatedStudents(); // Update paginated students
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  applyFilters() {
    this.currentPage = 1; // Reset to the first page when applying filters
    this.loadStudents(); // Load students based on the applied filters
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
    // Simply assign filteredStudents to paginatedStudents
    this.paginatedStudents = this.filteredStudents; // Since the server already returns only the required page
  }

  onPageChange(page: number) {
    // Check for valid page number
    if (page < 1 || page > Math.ceil(this.totalItems / this.itemsPerPage)) {
      return; // Prevent navigating to invalid page numbers
    }
    console.log('Page changed to:', page);
    this.currentPage = page;
    this.loadStudents(); // Fetch new paginated data from the server
  }

  exportToExcel() {
    // Prepare query parameters for exporting
    const queryParams: any = {};

    // Only add filters with valid values
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

    // Call the API to get all filtered student data for export
    this.service.getAllFilteredStudentData(queryParams).subscribe(
        data => {
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Students');
            XLSX.writeFile(wb, 'students_report.xlsx');
        },
        error => {
            console.error('Error exporting to Excel:', error);
        }
    );
}

}
