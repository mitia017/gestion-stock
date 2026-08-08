import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { NgClass, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Produit, MouvementStock } from '../../../models/types.models';
import { InventaireService } from '../../../services/inventaire.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, DatePipe, CurrencyPipe],
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

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
        error: (err) => {
          console.error(err);
          this.notify.toastError('Fiche produit introuvable ou inexistante.');
          this.router.navigate(['/inventaire']);
        }
      });
  }

  private chargerHistoriqueFlux(): void {
    this.service.getMouvementsByProduitId(this.produitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flux) => this.historiqueMouvements = flux.reverse(),
        error: (err) => {
          console.error(err);
          this.notify.toastError("Impossible d'extraire l'historique logistique.");
        }
      });
  }
}
