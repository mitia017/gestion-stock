import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', loadComponent : () => import('./pages/dashboard/dashboard.component').then(m => m.default)
  },
  {
    path: 'inventaire', loadComponent : () => import('./pages/inventaire/inventaire.component').then(m => m.InventaireComponent)
  },
  {
    path: 'mouvements', loadComponent : () => import('./pages/mouvement/mouvement.component').then(m => m.MouvementComponent)
  },
  {
    path: 'categorie', loadComponent : () => import('./pages/categorie/categorie.component').then(m => m.CategorieComponent)
  },
  {
    path: 'mouvements/entree', loadComponent : () => import('./components/mouvement/entree/entree.component').then(m => m.EntreeComponent)
  },
  {
    path: 'mouvements/sortie', loadComponent : () => import('./components/mouvement/sortie/sortie.component').then(m => m.SortieComponent)
  },
  {
    path: 'inventaire/create', loadComponent : () => import('./components/inventaire/formulaire/formulaire.component').then(m => m.FormulaireComponent)
  },
  {
    path: 'inventaire/edit/:id', loadComponent : () => import('./components/inventaire/edit/edit.component').then(m => m.EditComponent)
  },
  {
    path: 'inventaire/:id', loadComponent : () => import('./components/inventaire/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: 'categorie/create',
    loadComponent: () => import('./components/categorie/create/create.component').then(m => m.CreateComponent)
  },
  {
    path: 'categorie/edit/:id',
    loadComponent: () => import('./components/categorie/edit/edit.component').then(m => m.EditComponent)
  }
];
