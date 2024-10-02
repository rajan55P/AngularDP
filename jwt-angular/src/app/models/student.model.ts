// src/app/models/student.model.ts
export interface Student {
    studentId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date; // Change to Date if you want to handle it as a Date object
    className: string;
    score: number;
  }
  