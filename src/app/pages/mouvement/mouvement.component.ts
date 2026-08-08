import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MouvementStock } from '../../models/types.models';
import {MouvementsService} from '../../services/mouvements.service';
import {DashboardService} from '../../services/dashboard.service';

@Component({
  selector: 'app-mouvements',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, DatePipe, NgIf, RouterLink],
  templateUrl: './mouvement.component.html',
})
export class MouvementComponent implements OnInit {
  private readonly service = inject(MouvementsService);
  private readonly statistiqueService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  private tousLesMouvements: MouvementStock[] = [];
  public mouvementsAffiches: MouvementStock[] = [];

  public filterForm = new FormGroup({
    recherche: new FormControl(''),
    type: new FormControl('Tout'),
    periode: new FormControl('Ce mois')
  });

  ngOnInit(): void {
    this.chargerMouvements();
    this.ecouterFiltres();
    this.statistiqueService.emettreNouvelleListe(this.mouvementsAffiches);
  }

  private chargerMouvements(): void {
    this.service.getMouvements()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.tousLesMouvements = data;
          this.mouvementsAffiches = data;
          this.statistiqueService.emettreNouvelleListe(this.mouvementsAffiches);
        },
        error: (err) => console.error('Erreur chargement flux stock', err)
      });
  }

  private ecouterFiltres(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.appliquerFiltres());
  }

  private appliquerFiltres(): void {
    const { recherche, type } = this.filterForm.value;
    const term = recherche?.toLowerCase().trim() || '';

    this.mouvementsAffiches = this.tousLesMouvements.filter(m => {
      const matchRecherche =
        m.id.toString().includes(term) ||
        m.motif.toLowerCase().includes(term);

      const matchType = type === 'Tout' || m.type === type;

      return matchRecherche && matchType;
    });
  }

  onSupprimerMouvement(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce mouvement de stock ?')) return;

    this.service.deleteMouvement(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.mouvementsAffiches = this.mouvementsAffiches.filter(m => m.id !== id);
          this.statistiqueService.notifierSuppression(id);
          console.log(`Mouvement de stock #${id} supprimé.`);
        },
        error: (err) => {
          console.error("Échec de la suppression du mouvement :", err);
          alert("Impossible de supprimer ce mouvement. Il est peut-être lié à d'autres contraintes sur le serveur.");
        }
      });
  }


}
