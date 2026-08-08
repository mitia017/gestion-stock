import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {CurrencyPipe, NgClass} from '@angular/common';
import { Produit } from '../../../models/types.models';

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

  deleteProduct(id: number, event: Event): void {
    event.stopPropagation();
    this.produitSupprime.emit(id);
  }
}
