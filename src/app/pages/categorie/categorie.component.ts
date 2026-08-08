import { Component } from '@angular/core';
import {ListeComponent} from '../../components/categorie/liste/liste.component';

@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [ListeComponent],
  templateUrl: './categorie.component.html',
})
export class CategorieComponent {

}
