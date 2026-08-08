import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InventaireService } from '../../../services/inventaire.service';
import { Produit, MouvementStock } from '../../../models/types.models';
import {MouvementsService} from '../../../services/mouvements.service';

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

  public produits: Produit[] = [];

  public entreeForm = new FormGroup({
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
    if (this.entreeForm.invalid) {
      this.entreeForm.markAllAsTouched();
      return;
    }

    const formValue = this.entreeForm.value;
    const nouveauMouvement: Partial<MouvementStock> = {
      type: 'ENTREE',
      quantite: formValue.quantite!,
      motif: formValue.description!,
      produit: { id: Number(formValue.produitId) } as Produit // Mapping pour Hibernate
    };

    this.service.createMouvement(nouveauMouvement)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/mouvements']),
        error: (err) => console.error("Échec de la validation de l'entrée", err)
      });
  }
}
