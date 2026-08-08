import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Produit, MouvementStock } from '../../../models/types.models';
import {InventaireService} from '../../../services/inventaire.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, DatePipe, CurrencyPipe],
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  public produitId!: number;
  public produit?: Produit;
  public historiqueMouvements: MouvementStock[] = [];

  ngOnInit(): void {
    this.produitId = Number(this.route.snapshot.paramMap.get('id'));

    this.chargerFicheProduit();
    this.chargerHistoriqueFlux();
  }

  private chargerFicheProduit(): void {
    this.service.getProductById(this.produitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.produit = data,
        error: (err) => console.error("Impossible de charger la fiche produit", err)
      });
  }

  private chargerHistoriqueFlux(): void {
    this.service.getMouvementsByProduitId(this.produitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flux) => this.historiqueMouvements = flux.reverse(),
        error: (err) => console.error("Impossible de charger l'historique logistique", err)
      });
  }
}
