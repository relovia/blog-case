import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeLayoutComponent } from '../../shared/layouts/home-layout/home-layout.component';
import { BlogComponent } from '../../features/blog/blog.component';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, BlogComponent, HomeLayoutComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
})
export class BlogPageComponent {}
