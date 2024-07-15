import { Routes } from '@angular/router';
import { BlogPageComponent } from './blog-page.component';
import { BlogDetailPageComponent } from './blog-detail-page/blog-detail-page.component';

export const blogRoutes: Routes = [
  {
    path: 'blog',
    component: BlogPageComponent,
  },
  {
    path: 'blog/details/:id',
    component: BlogDetailPageComponent,
  },
];
