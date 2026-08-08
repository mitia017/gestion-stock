import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { Produit, Categorie } from '../../../models/types.models';
import {CategorieService} from '../../../services/categorie.service';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './formulaire.component.html'
})
export class FormulaireComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly categorieService = inject(CategorieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  public categories: Categorie[] = [];

  public produitForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required]),
    categorieId: new FormControl('', [Validators.required]),
    quantiteStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    prixAchat: new FormControl(0, [Validators.required, Validators.min(0)]),
    prixVente: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    seuilAlerte: new FormControl(5, [Validators.required, Validators.min(0)])
  });

  ngOnInit(): void {
    this.categorieService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error(err);
          this.notify.toastError('Impossible de charger les catégories.');
        }
      });
  }

  onSubmit(): void {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      this.notify.toastWarning('Veuillez remplir correctement tous les champs requis.');
      return;
    }

    const formValue = this.produitForm.value;
    const idSelectionne = Number(formValue.categorieId);

    const catCorrespondante = this.categories.find(c => c.id === idSelectionne);

    const nouveauProduit: Partial<Produit> = {
      nom: formValue.nom!,
      description: formValue.description!,
      prixAchat: formValue.prixAchat!,
      prixVente: formValue.prixVente!,
      quantiteStock: formValue.quantiteStock!,
      seuilAlerte: formValue.seuilAlerte!,
      categorie: {
        id: idSelectionne,
        nom: catCorrespondante ? catCorrespondante.nom : ''
      },
      stockFaible: formValue.quantiteStock! <= formValue.seuilAlerte!
    };

    this.service.createProduct(nouveauProduit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/inventaire']);
          this.notify.toastSuccess('Produit créé avec succès.');
        },
        error: (err) => {
          console.error("Détail de l'erreur serveur :", err);
          this.notify.toastError("Erreur lors de la création : contraintes de l'API.");
        }
      });
  }
}
