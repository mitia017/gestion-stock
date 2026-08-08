import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/types.models';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/categories';

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl);
  }

  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  createCategorie(categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, categorie);
  }

  updateCategorie(id: number, categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
