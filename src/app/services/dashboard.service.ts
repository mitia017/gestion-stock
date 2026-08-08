import { Injectable } from '@angular/core';
import {MouvementStock} from '../models/types.models';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private constructor(private http: HttpClient) {
  }
  getProduct(){
    return this.http.get('http://localhost:8080/api/produits')
  }

  private mouvementsSubject = new BehaviorSubject<MouvementStock[]>([]);

  public mouvements$ = this.mouvementsSubject.asObservable();

  public emettreNouvelleListe(mouvements: MouvementStock[]): void {
    this.mouvementsSubject.next(mouvements);
  }

  public notifierSuppression(id: number): void {
    const listeActuelle = this.mouvementsSubject.value;
    const listeMiseAJour = listeActuelle.filter(m => m.id !== id);
    this.mouvementsSubject.next(listeMiseAJour);
  }

}
