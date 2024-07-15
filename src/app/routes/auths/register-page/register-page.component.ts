import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AuthenticationControllerService,
  RegisterRequestParams,
} from '../../../shared/services/api';
import { ToastrService } from 'ngx-toastr';
import { HomeLayoutComponent } from '../../../shared/layouts/home-layout/home-layout.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HomeLayoutComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  isSuccessful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationControllerService,
    private change: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      identityNumber: ['', Validators.required],
    });
  }

  add() {
    const request: RegisterRequestParams = {
      registerRequest: {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        password: this.form.value.password,
        identityNumber: this.form.value.identityNumber,
      },
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log(response);
        this.isSuccessful = true;
        this.toastr.success('Registration successful', 'Success');
        this.form.reset();
        this.change.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.log('Registration error: ', error);
        this.isSuccessful = false;

        // Display the specific error message from the API
        if (error.error && error.error.detail) {
          this.toastr.error(error.error.detail, 'Registration Failed');
        } else {
          this.toastr.error('Registration failed. Please try again.', 'Error');
        }

        this.change.markForCheck();
      },
    });
  }
  onFormSubmit() {
    if (this.form.invalid) {
      this.isSuccessful = false;
      this.toastr.warning('Please fill all required fields', 'Warning');
      return;
    }
    this.add();
  }
}
