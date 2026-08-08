import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CategorieService } from '../../../services/categorie.service';
import { Categorie } from '../../../models/types.models';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './liste.component.html'
})
export class ListeComponent implements OnInit {
  private readonly service = inject(CategorieService);
  private readonly destroyRef = inject(DestroyRef);

  private toutesLesCategories: Categorie[] = [];
  public categoriesAffichees: Categorie[] = [];
  public rechercheCtrl = new FormControl('');

  ngOnInit(): void {
    this.service.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.toutesLesCategories = data;
          this.categoriesAffichees = data;
        },
        error: (err) => console.error(err)
      });

    this.rechercheCtrl.valueChanges
      .pipe(debounceTime(150), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(valeur => {
        const term = valeur?.toLowerCase().trim() || '';
        this.categoriesAffichees = this.toutesLesCategories.filter(c =>
          c.id.toString().includes(term) || c.nom.toLowerCase().includes(term)
        );
      });
  }

  onSupprimer(id: number): void {
    if (!confirm('Supprimer cette catégorie ?')) return;
    this.service.deleteCategorie(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toutesLesCategories = this.toutesLesCategories.filter(c => c.id !== id);
        this.categoriesAffichees = this.categoriesAffichees.filter(c => c.id !== id);
      });
  }
}
