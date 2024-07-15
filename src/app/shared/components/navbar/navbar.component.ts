import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  TemplateRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';

export type NavItem = {
  label: string;
  link: string;
};

export type NavTitle =
  | {
      text: string;
      routerLink?: string | string[];
    }
  | undefined;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() title: NavTitle;
  @Input() navItems: NavItem[] = [];
  @Input() endContentTemplate?: TemplateRef<any>;
  @Input() isLoggedIn: boolean = false;
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}
