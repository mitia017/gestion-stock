import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Produit } from '../../../models/types.models';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.css'
})
export class ListeComponent {
  @Input({ required: true }) produits: Produit[] = [];
  @Output() produitSupprime = new EventEmitter<number>();

  private readonly notify = inject(NotificationService);

  async deleteProduct(id: number, event: Event): Promise<void> {
    event.stopPropagation();

    const estConfirme = await this.notify.confirm(
      'Supprimer ce produit ?',
      'Cette action retirera définitivement l\'article de l\'inventaire global.',
      'Oui, supprimer'
    );

    if (estConfirme) {
      this.produitSupprime.emit(id);
    }
  }
}
