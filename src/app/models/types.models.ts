export interface Categorie{
  id: number,
  nom:	string,
  description?:	string
}

export  interface Produit {
  id: number,
  nom:  string,
  description:  string,
  prixAchat:  number,
  prixVente:  number,
  quantiteStock:  number,
  seuilAlerte:  number,
  dateAjout:  string,
  categorie:  Categorie,
  stockFaible:  boolean,
}

export interface MouvementStock{
  id:	number,
  produit:	Produit,
  type:	string,
  quantite:	number,
  motif:	string,
  dateMouvement:	string,
}
