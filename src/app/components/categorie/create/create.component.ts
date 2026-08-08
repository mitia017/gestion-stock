import { Component, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategorieService } from '../../../services/categorie.service';

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

  public categorieForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  onSubmit(): void {
    if (this.categorieForm.invalid) return;

    this.service.createCategorie({ nom: this.categorieForm.value.nom! })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/categorie']),
        error: (err) => console.error('Échec de la création', err)
      });
  }
}
