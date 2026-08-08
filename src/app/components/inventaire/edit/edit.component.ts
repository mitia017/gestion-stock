import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { Produit, Categorie } from '../../../models/types.models';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  private readonly service = inject(InventaireService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public categories: Categorie[] = [];
  public produitId!: number;

  public editForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required]),
    categorieId: new FormControl('', [Validators.required]),
    quantiteStock: new FormControl(0, [Validators.required, Validators.min(0)]),
    prixAchat: new FormControl(0, [Validators.required, Validators.min(0)]),
    prixVente: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    seuilAlerte: new FormControl(5, [Validators.required, Validators.min(0)])
  });

  ngOnInit(): void {
    this.produitId = Number(this.route.snapshot.paramMap.get('id'));

    this.initialiserDonnees();
  }

  private initialiserDonnees(): void {
    this.service.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(produits => {
        const mapUnique = new Map<number, Categorie>();
        produits.forEach(p => { if (p.categorie) mapUnique.set(p.categorie.id, p.categorie); });
        this.categories = Array.from(mapUnique.values());

        this.service.getProductById(this.produitId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (produit: { nom: any; description: any; categorie: { id: { toString: () => any; }; }; quantiteStock: any; prixAchat: any; prixVente: any; seuilAlerte: any; }) => {
              this.editForm.patchValue({
                nom: produit.nom,
                description: produit.description,
                categorieId: produit.categorie?.id.toString() || '',
                quantiteStock: produit.quantiteStock,
                prixAchat: produit.prixAchat,
                prixVente: produit.prixVente,
                seuilAlerte: produit.seuilAlerte
              });
            },
            error: (err: any) => console.error("Erreur lors de la récupération de l'article :", err)
          });
      });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.value;
    const idCatSelected = Number(formValue.categorieId);
    const catCorrespondante = this.categories.find(c => c.id === idCatSelected);

    const produitModifie: Partial<Produit> = {
      id: this.produitId,
      nom: formValue.nom!,
      description: formValue.description!,
      prixAchat: formValue.prixAchat!,
      prixVente: formValue.prixVente!,
      quantiteStock: formValue.quantiteStock!,
      seuilAlerte: formValue.seuilAlerte!,
      categorie: { id: idCatSelected, nom: catCorrespondante ? catCorrespondante.nom : '' },
      stockFaible: formValue.quantiteStock! <= formValue.seuilAlerte!
    };

    this.service.updateProduct(this.produitId, produitModifie)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          console.log('Modifications enregistrées !');
          this.router.navigate(['/inventaire']);
        },
        error: (err: any) => console.error("Erreur lors de la mise à jour :", err)
      });
  }
}
