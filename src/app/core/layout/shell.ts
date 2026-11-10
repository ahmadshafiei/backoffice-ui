import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from './footer/footer';
import { LayoutStore } from './layout-store';
import { MENU } from './menu.config';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar, Footer, Menu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  protected readonly layout = inject(LayoutStore);
  protected readonly menu = MENU;

  @HostListener('document:keydown.escape')
  protected onEscape(): void { this.layout.closeDrawer(); }
}
