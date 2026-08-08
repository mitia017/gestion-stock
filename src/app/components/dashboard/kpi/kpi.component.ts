import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBoxesStacked,
  faArrowDown,
  faArrowUp,
  faEuroSign
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-kpi',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './kpi.component.html'
})
export class KpiComponent {
  // Icônes adaptées
  faBoxes = faBoxesStacked;
  faEntree = faArrowDown;
  faSortie = faArrowUp;
  faEuro = faEuroSign;

  // Données attendues du parent
  @Input() totalProduits: number = 0;
  @Input() totalEntrees: number = 0;
  @Input() totalSorties: number = 0;
  @Input() prixTotalProduits: number = 0;
}
