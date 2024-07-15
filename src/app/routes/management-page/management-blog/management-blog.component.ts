import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BlogComponent } from '../../../features/blog/blog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-management-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogComponent],
  templateUrl: './management-blog.component.html',
  styleUrl: './management-blog.component.scss',
})
export class ManagementBlogComponent {}
