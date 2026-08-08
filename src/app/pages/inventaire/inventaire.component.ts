import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../services/inventaire.service';
import { NotificationService } from '../../services/notification.service';
import { Produit } from '../../models/types.models';
import { ListeComponent } from '../../components/inventaire/liste/liste.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventaire',
  standalone: true,
  imports: [ListeComponent, ReactiveFormsModule, RouterLink],
  templateUrl: "./inventaire.component.html"
})
export class InventaireComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  private tousLesProduits: Produit[] = [];
  public produitsAffiches: Produit[] = [];
  public categories: string[] = [];

  public filterForm = new FormGroup({
    recherche: new FormControl(''),
    categorie: new FormControl('Tous'),
    statut: new FormControl('Tout')
  });

  ngOnInit(): void {
    this.chargerProduits();
    this.ecouterChangementsFiltres();
  }

  private chargerProduits(): void {
    this.service.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.tousLesProduits = data;
          this.produitsAffiches = data;
          this.categories = ['Tous', ...new Set(data.map(p => p.categorie.nom))];
        },
        error: (err) => {
          console.error(err);
          this.notify.toastError('Impossible de charger les produits.');
        }
      });
  }

  private ecouterChangementsFiltres(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.appliquerFiltres());
  }

  private appliquerFiltres(): void {
    const { recherche, categorie, statut } = this.filterForm.value;
    const searchString = recherche?.toLowerCase().trim() || '';

    this.produitsAffiches = this.tousLesProduits.filter(produit => {
      const correspondRecherche =
        produit.nom.toLowerCase().includes(searchString) ||
        produit.description.toLowerCase().includes(searchString) ||
        produit.id.toString().includes(searchString);

      const correspondCategorie =
        categorie === 'Tous' || produit.categorie.nom === categorie;

      let correspondStatut = true;
      if (statut === 'Stock Faible') correspondStatut = produit.stockFaible;
      if (statut === 'Stock Normal') correspondStatut = !produit.stockFaible;

      return correspondRecherche && correspondCategorie && correspondStatut;
    });
  }

  onSupprimerProduit(id: number): void {
    this.service.deleteProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tousLesProduits = this.tousLesProduits.filter(p => p.id !== id);
          this.appliquerFiltres();
          this.notify.toastSuccess('Le produit a été supprimé avec succès.');
        },
        error: (err) => {
          console.error(err);
          if (err.status === 500 || err.status === 400) {
            this.notify.toastError('Impossible de supprimer : ce produit possède un historique de mouvements de stock.');
          } else {
            this.notify.toastError('Erreur lors de la suppression du produit.');
          }
        }
      });
  }
}
