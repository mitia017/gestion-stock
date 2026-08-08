import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Produit } from '../../../models/types.models';
import {InventaireService} from '../../../services/inventaire.service';

@Component({
  selector: 'app-alertes-stock',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './alertes-stock.component.html'
})
export class AlertesStockComponent implements OnInit {
  private readonly produitService = inject(InventaireService);
  private readonly destroyRef = inject(DestroyRef);

  public alertesProduits: Produit[] = [];

  ngOnInit(): void {
    this.chargerAlertes();
  }

  private chargerAlertes(): void {
    this.produitService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (produits: Produit[]) => {
          this.alertesProduits = produits
            .filter(p => p.stockFaible)
            .sort((a, b) => a.quantiteStock - b.quantiteStock)
            .slice(0, 5);
        },
        error: (err) => console.error("Impossible de charger les alertes de stock", err)
      });
  }
}
