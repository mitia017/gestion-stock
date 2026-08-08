import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { MouvementsService } from '../../../services/mouvements.service';
import { NotificationService } from '../../../services/notification.service';
import { Produit } from '../../../models/types.models';

@Component({
  selector: 'app-formulaire-entree',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './entree.component.html'
})
export class EntreeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly service = inject(MouvementsService);
  private readonly inventaireService = inject(InventaireService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  public produits: Produit[] = [];

  public entreeForm = new FormGroup({
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
    if (this.entreeForm.invalid) {
      this.entreeForm.markAllAsTouched();
      this.notify.toastWarning('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    const formValue = this.entreeForm.value;

    const nouveauMouvement = {
      type: 'ENTREE',
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
