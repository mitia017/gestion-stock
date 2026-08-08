import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MouvementStock, Produit} from '../models/types.models';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/produits';

  getProducts(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  createProduct(produit: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, produit: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  getMouvementsByProduitId(produitId: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`http://localhost:8080/api/mouvements/produit/${produitId}`);
  }

}
