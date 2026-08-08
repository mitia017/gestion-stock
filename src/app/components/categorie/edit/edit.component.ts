import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategorieService } from '../../../services/categorie.service';

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

  public categorieId!: number;
  public categorieForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    this.categorieId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getCategorieById(this.categorieId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cat => this.categorieForm.patchValue({ nom: cat.nom }));
  }

  onSubmit(): void {
    if (this.categorieForm.invalid) return;

    this.service.updateCategorie(this.categorieId, { nom: this.categorieForm.value.nom! })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/categorie']),
        error: (err) => console.error('Échec de la modification', err)
      });
  }
}
