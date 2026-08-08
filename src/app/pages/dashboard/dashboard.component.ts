import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../components/dashboard/chart/chart.component';
import { KpiComponent } from '../../components/dashboard/kpi/kpi.component';
import { DashboardService } from '../../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MouvementStock } from '../../models/types.models';
import { MouvementsService } from '../../services/mouvements.service';
import { AlertesStockComponent } from '../../components/dashboard/alertes-stock/alertes-stock.component';
import { NotificationService } from '../../services/notification.service'; // <-- Ajout de l'import

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, KpiComponent, AlertesStockComponent],
  templateUrl: './dashboard.component.html',
})
class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly mouvementService = inject(MouvementsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(NotificationService);

  totalProduits = 0;
  totalEntrees = 0;
  totalSorties = 0;
  prixTotalProduits = 0;
  private produits: any = {};

  ngOnInit() {
    this.dashboardService.getProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.produits = res;
          this.prixTotalProduits = 0;
          this.totalProduits = 0;

          for (const product of this.produits) {
            this.prixTotalProduits += product.prixVente * product.quantiteStock;
            this.totalProduits += product.quantiteStock;
          }
        },
        error: (err) => {
          console.error(err);
          this.notify.toastError('Impossible de charger les statistiques des produits.');
        }
      });

    this.dashboardService.mouvements$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mouvements: MouvementStock[]) => {
        this.calculerTotaux(mouvements);
      });

    this.mouvementService.getMouvements()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.dashboardService.emettreNouvelleListe(data);
        },
        error: (err) => {
          console.error("Impossible d'alimenter les KPI au démarrage :", err);
          this.notify.toastWarning('Flux des mouvements de stock indisponible.');
        }
      });
  }

  private calculerTotaux(mouvements: MouvementStock[]): void {
    this.totalEntrees = mouvements.filter((m: MouvementStock) => m.type === 'ENTREE').length;
    this.totalSorties = mouvements.filter((m: MouvementStock) => m.type === 'SORTIE').length;
  }
}

export default DashboardComponent;
