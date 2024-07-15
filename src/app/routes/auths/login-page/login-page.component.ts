import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AuthenticationControllerService,
  LoginRequestParams,
} from '../../../shared/services/api';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../shared/services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { HomeLayoutComponent } from '../../../shared/layouts/home-layout/home-layout.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HomeLayoutComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  formMessage: string | null = null;
  isSuccessful: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationControllerService,
    private change: ChangeDetectorRef,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    const request: LoginRequestParams = {
      loginRequest: {
        email: this.form.value.email,
        password: this.form.value.password,
      },
    };

    console.log('Request: ', request);

    this.authService.login(request).subscribe({
      // Next: Observable'dan gelen veriyi yakaladığımız fonksiyon
      next: (response) => {
        this.tokenService.setToken(response.token as string);
        this.isSuccessful = true;
        this.toastr.success('Login successful', 'Success');
        this.form.reset();
        this.change.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      // Error: Observable'dan gelen hatayı yakaladığımız fonksiyon
      error: (error) => {
        console.log('Login error: ', error);
        this.isSuccessful = false;

        // Display the specific error message from the API
        if (error.error && error.error.detail) {
          this.toastr.error(error.error.detail, 'Login Failed');
        } else {
          this.toastr.error('Login failed. Please try again.', 'Error');
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
    this.login();
  }
}
