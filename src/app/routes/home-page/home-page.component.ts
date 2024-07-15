import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeLayoutComponent } from '../../shared/layouts/home-layout/home-layout.component';
import { BlogComponent } from '../../features/blog/blog.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HomeLayoutComponent, BlogComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
