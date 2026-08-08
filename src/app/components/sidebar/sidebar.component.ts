import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHouse,
  faLayerGroup,
  faBox,
  faRightLeft,
  faFolder
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  iconEntrepot = faHouse;
  iconStock = faLayerGroup;
  iconArrivage = faBox;
  iconTransaction = faRightLeft;
  iconCategorie = faFolder;
}
