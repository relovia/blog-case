import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BlogPostControllerService,
  CreateBlogPostRequestParams,
} from '../../../../shared/services/api';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-blog-form.component.html',
  styleUrl: './add-blog-form.component.scss',
})
export class AddBlogFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogPostControllerService,
    private change: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      authorId: ['', Validators.required],
    });
  }

  createBlogPost() {
    const request: CreateBlogPostRequestParams = {
      createBlogPostRequest: {
        title: this.form.value.title,
        content: this.form.value.content,
        authorId: this.form.value.authorId,
      },
    };

    this.blogService.createBlogPost(request).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        if (error.status === 403) {
          this.toastr.error(
            'You do not have permission to create a blog post.'
          );
          setTimeout(() => {
            this.router.navigate(['/management/blog']);
          }, 2000);
        } else {
          console.error('Error creating blog post:', error);
          this.toastr.error('Failed to create blog post');
        }
      },
      complete: () => {
        this.toastr.success('Blog post created successfully', 'Success');
        this.form.reset();
        this.change.markForCheck();

        setTimeout(() => {
          this.router.navigate(['/management/blog']);
        }, 2000);
      },
    });
  }

  onFormSubmit() {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all the required fields', 'Warning');
      return;
    }

    this.createBlogPost();
  }
}
