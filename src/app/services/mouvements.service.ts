import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MouvementStock } from '../models/types.models';

@Injectable({
  providedIn: 'root'
})
export class MouvementsService {

  apiUrl = "http://localhost:8080/api/mouvements"

  constructor(private http: HttpClient) { }

  getMouvements(): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(this.apiUrl);
  }

  getMouvementById(id: number): Observable<MouvementStock> {
    return this.http.get<MouvementStock>(`${this.apiUrl}/${id}`);
  }

  deleteMouvement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createMouvement(mouvement: any): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(this.apiUrl, mouvement);
  }
}
