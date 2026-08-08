import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { MouvementsService } from '../../../services/mouvements.service';
import { Produit, MouvementStock } from '../../../models/types.models';

@Component({
  selector: 'app-formulaire-sortie',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './sortie.component.html'
})
export class SortieComponent implements OnInit {
  private readonly service = inject(MouvementsService);
  private readonly inventaireService = inject(InventaireService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public produits: Produit[] = [];

  public sortieForm = new FormGroup({
    produitId: new FormControl('', [Validators.required]),
    quantite: new FormControl(1, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this.inventaireService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.produits = data);
  }

  onSubmit(): void {
    if (this.sortieForm.invalid) {
      this.sortieForm.markAllAsTouched();
      return;
    }

    const formValue = this.sortieForm.value;
    const prodSelectionne = this.produits.find(p => p.id === Number(formValue.produitId));

    if (prodSelectionne && prodSelectionne.quantiteStock < formValue.quantite!) {
      alert(`Erreur : Stock insuffisant. Il ne reste que ${prodSelectionne.quantiteStock} unités disponibles.`);
      return;
    }

    const nouveauMouvement: Partial<MouvementStock> = {
      type: 'SORTIE',
      quantite: formValue.quantite!,
      motif: formValue.description!,
      produit: { id: Number(formValue.produitId) } as Produit
    };

    this.service.createMouvement(nouveauMouvement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/mouvements']),
        error: (err) => {
          console.error(err);
          alert("Erreur serveur lors du déstockage.");
        }
      });
  }
}
