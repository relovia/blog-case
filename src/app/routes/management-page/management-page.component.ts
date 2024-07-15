import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeLayoutComponent } from '../../shared/layouts/home-layout/home-layout.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-management-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeLayoutComponent],
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.scss',
})
export class ManagementPageComponent {}
