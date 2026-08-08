import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { MouvementsService } from '../../../services/mouvements.service';
import { NotificationService } from '../../../services/notification.service';
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
  private readonly notify = inject(NotificationService);

  public produits: Produit[] = [];

  public sortieForm = new FormGroup({
    produitId: new FormControl('', [Validators.required]),
    quantite: new FormControl(1, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this.inventaireService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.produits = data,
        error: (err) => {
          console.error(err);
          this.notify.toastError('Impossible de récupérer la liste des produits.');
        }
      });
  }

  onSubmit(): void {
    if (this.sortieForm.invalid) {
      this.sortieForm.markAllAsTouched();
      this.notify.toastWarning('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    const formValue = this.sortieForm.value;

    const nouveauMouvement = {
      type: 'SORTIE',
      quantite: Number(formValue.quantite!),
      motif: formValue.description!,
      produit: { id: Number(formValue.produitId) }
    };

    this.service.createMouvement(nouveauMouvement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.toastSuccess('Mouvement d\'entrée enregistré avec succès.');
          this.router.navigate(['/mouvements']);
        },
        error: (err) => {
          console.error(err);
          const messageServeur = err.error?.message || "Erreur de validation des données.";
          this.notify.toastError(`Erreur 400 : ${messageServeur}`);
        }
      });
  }

}
