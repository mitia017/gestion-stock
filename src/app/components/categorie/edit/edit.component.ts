import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategorieService } from '../../../services/categorie.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  private readonly service = inject(CategorieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  public categorieId!: number;
  public categorieForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.categorieId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getCategorieById(this.categorieId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cat) => {
          this.categorieForm.patchValue({
            nom: cat.nom,
            description: cat.description
          });
        },
        error: (err) => {
          console.error(err);
          this.notify.toastError('Impossible de récupérer la catégorie.');
          this.router.navigate(['/categorie']);
        }
      });
  }

  onSubmit(): void {
    if (this.categorieForm.invalid) {
      this.notify.toastWarning('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    const payload = {
      nom: this.categorieForm.value.nom!,
      description: this.categorieForm.value.description!
    };

    this.service.updateCategorie(this.categorieId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.toastSuccess('La catégorie a été modifiée avec succès.');
          this.router.navigate(['/categorie']);
        },
        error: (err) => {
          console.error('Échec de la modification', err);
          this.notify.toastError('Erreur lors de la mise à jour de la catégorie.');
        }
      });
  }
}
