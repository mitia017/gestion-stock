import { Component, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategorieService } from '../../../services/categorie.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create.component.html'
})
export class CreateComponent {
  private readonly service = inject(CategorieService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  public categorieForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.categorieForm.invalid) {
      this.notify.toastWarning('Veuillez remplir correctement tous les champs obligatoires.');
      return;
    }

    const payload = {
      nom: this.categorieForm.value.nom!,
      description: this.categorieForm.value.description!
    };

    this.service.createCategorie(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notify.toastSuccess('La catégorie a été créée avec succès !');
          this.router.navigate(['/categorie']);
        },
        error: (err) => {
          console.error('Échec de la création', err);
          this.notify.toastError('Impossible de créer la catégorie.');
        }
      });
  }
}
