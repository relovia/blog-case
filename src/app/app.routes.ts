import { Routes } from '@angular/router';
import { homeRoutes } from './routes/home-page/home.routes';
import { aboutRoutes } from './routes/about-page/about.routes';
import { contactRoutes } from './routes/contact-page/contact.routes';
import { blogRoutes } from './routes/blog-page/blog.routes';
import { managementRoutes } from './routes/management-page/management-page.routes';
import { registerRoutes } from './routes/auths/register-page/register.routes';
import { loginRoutes } from './routes/auths/login-page/login.routes';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';

export const routes: Routes = [
  ...homeRoutes,
  ...aboutRoutes,
  ...contactRoutes,
  ...blogRoutes,
  ...managementRoutes,
  ...registerRoutes,
  ...loginRoutes,
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
