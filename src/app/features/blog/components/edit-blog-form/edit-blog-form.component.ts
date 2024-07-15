import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BlogPostControllerService,
  UpdateBlogPostRequestParams,
} from '../../../../shared/services/api';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-blog-form.component.html',
  styleUrl: './edit-blog-form.component.scss',
})
export class EditBlogFormComponent implements OnInit {
  @Input() blogId!: number;

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
    this.getBlogPost();
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  getBlogPost() {
    this.blogService.getBlogPostById({ id: this.blogId }).subscribe((post) => {
      this.form.patchValue({
        title: post.title,
        content: post.content,
      });
    });
  }

  editBlogPost() {
    const request: UpdateBlogPostRequestParams = {
      updateBlogPostRequest: {
        id: this.blogId,
        title: this.form.value.title,
        content: this.form.value.content,
      },
    };

    this.blogService.updateBlogPost(request).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/management/blog']);
      },
      error: (error) => {
        console.error('Error updating blog post:', error);
        this.toastr.error('Failed to update blog post');
      },
      complete: () => {
        this.toastr.success('Blog post updated successfully', 'Success');
        this.form.reset();
        this.change.markForCheck();
      },
    });
  }

  onFormSubmit() {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all the required fields', 'Warning');
      return;
    }

    this.editBlogPost();
  }
}
