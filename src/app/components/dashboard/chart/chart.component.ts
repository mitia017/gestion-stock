import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {
  constructor(private http: HttpClient) {}

  private chartEntry: number[] = [];
  private chartSortie: number[] = [];

  public chartLabels: string[] = [];

  private loadData() {

    this.http
      .get<any[]>('http://localhost:8080/api/mouvements')
      .subscribe({

        next: (mouvements) => {

          this.filterMouvements(mouvements);

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  private filterMouvements(mouvements: any[]) {

    const today = new Date();

    const labels: string[] = [];

    const entrees = new Array(30).fill(0);

    const sorties = new Array(30).fill(0);

    const dates: Date[] = [];

    for (let i = 29; i >= 0; i--) {

      const d = new Date(today);

      d.setHours(0,0,0,0);

      d.setDate(today.getDate() - i);

      dates.push(d);

      labels.push(d.getDate().toString());

    }

    mouvements.forEach(m => {

      const date = new Date(m.dateMouvement);

      date.setHours(0,0,0,0);

      const index = dates.findIndex(d =>
        d.getTime() === date.getTime()
      );

      if(index === -1)
        return;

      if(m.type === 'ENTREE'){

        entrees[index] += m.quantite;

      }

      if(m.type === 'SORTIE'){

        sorties[index] += m.quantite;

      }

    });

    this.chartLabels = labels;

    this.chartEntry = entrees;

    this.chartSortie = sorties;

    this.globalEvolution = this.calculateEvolution();

    this.refreshChart();

  }

  private refreshChart() {

    this.chartData = {

      labels: this.chartLabels,

      datasets: [

        {

          ...this.chartData.datasets[0],

          data: this.globalEvolution

        },

        {

          ...this.chartData.datasets[1],

          data: this.chartEntry

        },

        {

          ...this.chartData.datasets[2],

          data: this.chartSortie

        }

      ]

    };

  }

  ngOnInit(): void {
    this.loadData();
  }
  public chartType: ChartType = 'bar';

  private stockDebutMois = 10;

  private chartGlobalEvolution:any[] = []

  private calculateEvolution(): number[] {

    let stock = this.stockDebutMois;

    const evolution: number[] = [];

    for(let i = 0; i < this.chartEntry.length; i++){

      stock += this.chartEntry[i];

      stock -= this.chartSortie[i];

      evolution.push(stock);
    }

    return evolution;

  }

  private globalEvolution = this.calculateEvolution()

  public chartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: this.chartLabels,
    datasets: [
      {
        type: 'line',
        label: 'Évolution Globale',
        data: this.globalEvolution,
        borderColor: '#3b82f6',
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        tension: 0.4,
        order: 1
      },
      {
        type: 'bar',
        label: 'Entrées',
        data: this.chartEntry,
        backgroundColor: '#22c55e',
        borderRadius: 4,
        barThickness: 8,
        order: 2
      },
      {
        type: 'bar',
        label: 'Sorties',
        data: this.chartSortie,
        backgroundColor: '#ef4444',
        borderRadius: 4,
        barThickness: 8,
        order: 2
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        border: {
          dash: [5, 5]
        },
        grid: {
          color: '#cbd5e1'
        },
        min: 0,
        max: 700,
        ticks: {
          stepSize: 50,
          color: '#64748b'
        }
      }
    }
  };
}
