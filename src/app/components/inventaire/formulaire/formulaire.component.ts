import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { Produit, Categorie } from '../../../models/types.models';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './formulaire.component.html'
})
export class FormulaireComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    this.service.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        const mapUnique = new Map<number, Categorie>();
        data.forEach(p => {
          if (p.categorie && p.categorie.id) {
            mapUnique.set(p.categorie.id, p.categorie);
          }
        });
        this.categories = Array.from(mapUnique.values());
      });
  }

  onSubmit(): void {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
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
          alert('Produit créé avec succès')
        },
        error: (err) => {
          console.error("Détail de l'erreur serveur :", err);
          alert("Erreur lors de la création : vérifiez les données ou les contraintes de votre API.");
        }
      });
  }
}
