import { Component } from '@angular/core';
import { JwtService } from '../../service/jwt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  message!: string;

  constructor(
    private service: JwtService
  ) { }

  ngOnInit() {
    this.hello();
  }

  hello() {
    this.service.hello().subscribe(
      (response) => {
        console.log(response);
        this.message = response.message;
      }
    )
  }
  studentCount: number = 0; // Initialize the count to 0

  generateData() {
    console.log("Generating data...with count "+ this.studentCount);
    if (this.studentCount > 0) {
      this.service.generateData(this.studentCount).subscribe(
        (response) => {
          console.log('Student data generated:');
        },
        (error) => {
          console.error('Error generating student data:', error);
          // Handle error, such as showing an error message
        }
      );
    } else {
      console.warn('Please enter a valid number of students');
      // Optionally, display a message to the user to enter a valid count
    }
  }

  processData() {
    console.log("Processing data...");
    this.service.processData().subscribe((response) => {
      console.log(response);
      this.message = response.message;
    })
  }

  uploadData() {
    console.log("Uploading data...");
    this.service.uploadData().subscribe((response) => {
      console.log(response);
      this.message = response.message;
    })
  }
}
