import { Routes } from '@angular/router';
import { authGuard } from '../../shared/guards/auth.guard';
import { ManagementPageComponent } from './management-page.component';
import { ManagementBlogComponent } from './management-blog/management-blog.component';
import { AddBlogFormComponent } from '../../features/blog/components/add-blog-form/add-blog-form.component';
import { EditBlogFormComponent } from '../../features/blog/components/edit-blog-form/edit-blog-form.component';

export const managementRoutes: Routes = [
  {
    path: 'management',
    canActivate: [authGuard],
    component: ManagementPageComponent,
    children: [
      // Blog Management
      {
        path: 'blog',
        component: ManagementBlogComponent,
        data: {
          requiredRoles: ['USER'],
        },
      },
      {
        path: 'blog/create',
        component: AddBlogFormComponent,
        data: {
          requiredRoles: ['USER'],
        },
      },
      {
        path: 'blog/edit/:id',
        component: EditBlogFormComponent,
        data: {
          requiredRoles: ['USER'],
        },
      },
    ],
  },
];
