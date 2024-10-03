import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

    registerForm!: FormGroup;

    constructor(
      private service: JwtService,
      private fb: FormBuilder,
      private router: Router
    ) { }
    
    ngOnInit(): void {
      this.registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      }, { validator: this.passwordMathValidator })
    }
  
    passwordMathValidator(formGroup: FormGroup) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (password != confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
    }

    submitForm() {
      console.log(this.registerForm.value);
      this.service.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Response', response);
          this.router.navigateByUrl("/login");
        })
    }

}
