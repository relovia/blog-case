import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {
  NavbarComponent,
  NavItem,
  NavTitle,
} from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss'],
})
export class HomeLayoutComponent implements OnInit {
  navTitle: NavTitle = {
    text: 'Blog',
    routerLink: '/',
  };
  navItems: NavItem[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' },
    { label: 'Blog Management', link: '/management/blog' },
  ];
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private change: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.change.markForCheck();
  }

  logout(): void {
    this.authService.logout();
    this.checkLoginStatus();
  }
}
