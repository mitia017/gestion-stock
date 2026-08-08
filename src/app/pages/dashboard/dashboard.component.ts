import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import { ChartComponent } from '../../components/dashboard/chart/chart.component';
import {KpiComponent} from '../../components/dashboard/kpi/kpi.component';
import {DashboardService} from '../../services/dashboard.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MouvementStock} from '../../models/types.models';
import {MouvementsService} from '../../services/mouvements.service';
import {AlertesStockComponent} from '../../components/dashboard/alertes-stock/alertes-stock.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, KpiComponent, AlertesStockComponent],
  templateUrl: './dashboard.component.html',
})
class DashboardComponent implements OnInit{
  private readonly dashboardService = inject(DashboardService);
  private readonly mouvementService = inject(MouvementsService)
  private readonly destroyRef = inject(DestroyRef);

  totalProduits = 0;
  totalEntrees = 0;
  totalSorties = 0;
  prixTotalProduits = 0
  private produits: any = [0];

  ngOnInit(){
    this.dashboardService.getProduct().subscribe(res => {
      this.produits = res;
      this.prixTotalProduits = 0
      for(const product of this.produits){
        this.prixTotalProduits += product.prixVente * product.quantiteStock
        this.totalProduits += product.quantiteStock
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
        error: (err) => console.error("Impossible d'alimenter les KPI au démarrage :", err)
      });
  }
  private calculerTotaux(mouvements: MouvementStock[]): void {
    this.totalEntrees = mouvements.filter((m: MouvementStock) => m.type === 'ENTREE').length;
    this.totalSorties = mouvements.filter((m: MouvementStock) => m.type === 'SORTIE').length;
  }

}

export default DashboardComponent
