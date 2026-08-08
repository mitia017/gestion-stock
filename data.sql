-- =========================================================================
-- 1. CATEGORIES (10 catégories)
-- =========================================================================
MERGE INTO categories (id, nom, description) KEY(id) VALUES
  (1, 'Boissons', 'Boissons diverses (eau, soda, jus)'),
  (2, 'Epicerie', 'Produits alimentaires secs et pâtes'),
  (3, 'Hygiene', 'Produits d''hygiene et de soin corporel'),
  (4, 'Frais', 'Produits laitiers, œufs et frais'),
  (5, 'Entretien', 'Produits de nettoyage et maison'),
  (6, 'Boulangerie', 'Pain, viennoiseries et biscuits'),
  (7, 'Conserves', 'Plats cuisinés, thon, sardines en boîte'),
  (8, 'Surgeles', 'Légumes et plats surgelés'),
  (9, 'Bbebe', 'Alimentation et soins pour bébés'),
  (10, 'Snacks', 'Chips, biscuits apéritifs et chocolats');

-- =========================================================================
-- 2. PRODUITS (60 produits - Stocks recalculés et cohérents)
-- =========================================================================
MERGE INTO produits (id, nom, description, prix_achat, prix_vente, quantite_stock, seuil_alerte, date_ajout, categorie_id) KEY(id) VALUES
  -- Catégorie 1 : Boissons (1 à 6)
  (1, 'Eau minerale 1.5L', 'Bouteille d''eau', 300, 500, 60, 10, '2026-06-26 08:00:00', 1),
  (2, 'Soda 33cl', 'Boisson gazeuse cola', 400, 700, 35, 10, '2026-06-27 09:00:00', 1),
  (3, 'Jus d''orange 1L', 'Jus pur jus', 900, 1300, 30, 6, '2026-06-28 10:00:00', 1),
  (4, 'Boisson energetique', 'Cannette 250ml', 600, 1000, 15, 5, '2026-06-29 11:00:00', 1),
  (5, 'Thé glacé 1.5L', 'Goût pêche', 700, 1100, 32, 8, '2026-06-30 12:00:00', 1),
  (6, 'Sirop de menthe', 'Bouteille 75cl', 1200, 1600, 22, 4, '2026-07-01 08:30:00', 1),

  -- Catégorie 2 : Epicerie (7 à 12)
  (7, 'Riz 5kg', 'Sac de riz local', 8000, 10000, 33, 5, '2026-06-26 10:30:00', 2),
  (8, 'Pâtes 500g', 'Coquillettes', 450, 700, 70, 15, '2026-06-27 14:00:00', 2),
  (9, 'Huile de tournesol 1L', 'Bouteille d''huile', 1500, 1900, 35, 5, '2026-06-28 15:00:00', 2),
  (10, 'Sucre en poudre 1kg', 'Sucre blanc', 900, 1200, 48, 10, '2026-06-29 16:00:00', 2),
  (11, 'Sel fin 1kg', 'Sachet de sel', 250, 400, 40, 10, '2026-06-30 09:00:00', 2),
  (12, 'Farine de blé 1kg', 'Farine type 55', 800, 1100, 39, 6, '2026-07-01 10:00:00', 2),

  -- Catégorie 3 : Hygiène (13 à 18)
  (13, 'Savon de toilette', 'Savon 100g', 500, 800, 13, 5, '2026-07-02 14:15:00', 3),
  (14, 'Dentifrice 75ml', 'Menthe fraîche', 800, 1200, 25, 5, '2026-07-03 11:00:00', 3),
  (15, 'Gel douche 250ml', 'Parfum vanille', 1200, 1700, 19, 4, '2026-07-04 13:00:00', 3),
  (16, 'Shampooing 400ml', 'Cheveux normaux', 1800, 2400, 22, 4, '2026-07-05 15:00:00', 3),
  (17, 'Papier toilette (x6)', 'Paquet de 6 rouleaux', 2000, 2800, 45, 8, '2026-07-06 08:00:00', 3),
  (18, 'Déodorant spray', 'Fraîcheur intense', 1500, 2200, 18, 3, '2026-07-07 09:30:00', 3),

  -- Catégorie 4 : Frais (19 à 24)
  (19, 'Lait demi-ecreme 1L', 'Brique de lait', 700, 950, 25, 5, '2026-07-08 07:45:00', 4),
  (20, 'Yaourt nature (x4)', 'Pack de 4', 1200, 1600, 18, 4, '2026-07-09 11:20:00', 4),
  (21, 'Beurre doux 250g', 'Plaquette de beurre', 1400, 1900, 23, 4, '2026-07-10 10:00:00', 4),
  (22, 'Fromage râpé 200g', 'Emmental râpé', 1600, 2200, 20, 3, '2026-07-11 12:00:00', 4),
  (23, 'Œufs x6', 'Boîte de 6 œufs frais', 900, 1200, 53, 10, '2026-07-12 14:00:00', 4),
  (24, 'Crème fraîche 20cl', 'Pot de crème', 1000, 1400, 20, 4, '2026-07-13 16:00:00', 4),

  -- Catégorie 5 : Entretien (25 à 30)
  (25, 'Lessive en poudre 1kg', 'Poudre lave-linge', 2500, 3200, 27, 3, '2026-07-14 16:00:00', 5),
  (26, 'Liquide vaisselle 500ml', 'Senteur citron', 900, 1300, 30, 6, '2026-07-15 09:00:00', 5),
  (27, 'Éponges (x3)', 'Lot de 3 éponges', 400, 700, 45, 10, '2026-07-16 10:00:00', 5),
  (28, 'Nettoyant sol 1L', 'Multi-usages', 1500, 2100, 28, 5, '2026-07-17 11:00:00', 5),
  (29, 'Javel 1L', 'Flacon berlingot', 600, 900, 33, 5, '2026-07-18 13:00:00', 5),
  (30, 'Sacs poubelle 30L', 'Rouleau de 25 sacs', 1100, 1600, 37, 6, '2026-07-19 14:00:00', 5),

  -- Catégorie 6 : Boulangerie (31 à 36)
  (31, 'Pain de mie 500g', 'Tranches nature', 1000, 1400, 18, 4, '2026-07-20 07:00:00', 6),
  (32, 'Biscuits secs 200g', 'Paquet de biscuits', 800, 1200, 40, 8, '2026-07-20 08:00:00', 6),
  (33, 'Croissants (x4)', 'Viennoiseries pur beurre', 1500, 2000, 9, 3, '2026-07-21 07:30:00', 6),
  (34, 'Brioche tranchée', 'Brioche pur beurre', 1800, 2400, 14, 3, '2026-07-21 09:00:00', 6),
  (35, 'Galettes salées', 'Paquet de 10', 900, 1300, 26, 5, '2026-07-22 10:00:00', 6),
  (36, 'Petits gâteaux choco', 'Boîte de 12', 1300, 1800, 25, 4, '2026-07-22 11:00:00', 6),

  -- Catégorie 7 : Conserves (37 à 42)
  (37, 'Thon en boîte 160g', 'Emietté de thon', 1200, 1700, 16, 5, '2026-06-26 11:00:00', 7),
  (38, 'Sardines à l''huile 125g', 'Boîte de sardines', 800, 1200, 28, 5, '2026-06-28 13:00:00', 7),
  (39, 'Tomates concassées 400g', 'Boîte de conserve', 600, 900, 53, 8, '2026-06-30 15:00:00', 7),
  (40, 'Petits pois & carottes', 'Boîte 400g', 900, 1300, 38, 6, '2026-07-02 10:00:00', 7),
  (41, 'Maïs doux 300g', 'Boîte de maïs', 700, 1000, 39, 7, '2026-07-05 12:00:00', 7),
  (42, 'Ravioli bœuf 800g', 'Boîte repas', 2000, 2700, 24, 4, '2026-07-08 14:00:00', 7),

  -- Catégorie 8 : Surgelés (43 à 48)
  (43, 'Frites surgelées 1kg', 'Sachet de frites', 1500, 2100, 22, 5, '2026-07-03 16:00:00', 8),
  (44, 'Légumes pour soupe', 'Sachet 1kg', 1300, 1800, 16, 4, '2026-07-06 10:00:00', 8),
  (45, 'Steaks hachés (x4)', 'Surgelés pur bœuf', 2200, 2900, 12, 3, '2026-07-09 11:00:00', 8),
  (46, 'Poissons panés (x4)', 'Filets de colin', 1900, 2500, 18, 4, '2026-07-12 15:00:00', 8),
  (47, 'Pizzas surgelées', 'Pizza 3 fromages', 2000, 2800, 11, 3, '2026-07-15 09:00:00', 8),
  (48, 'Glaces vanille 1L', 'Bac de crème glacée', 2500, 3400, 12, 2, '2026-07-18 11:00:00', 8),

  -- Catégorie 9 : Bébé (49 à 54)
  (49, 'Couches taille 3 (x30)', 'Paquet de couches', 5000, 6500, 8, 3, '2026-06-27 08:00:00', 9),
  (50, 'Lingettes bébé (x72)', 'Paquet sensible', 1200, 1700, 30, 6, '2026-07-01 10:00:00', 9),
  (51, 'Lait 2eme âge 900g', 'Boîte de lait infantile', 7500, 9500, 16, 3, '2026-07-05 14:00:00', 9),
  (52, 'Petite pot légume (x2)', 'Purée carotte', 1500, 2100, 19, 4, '2026-07-10 16:00:00', 9),
  (53, 'Petite pot fruit (x2)', 'Compote pomme', 1400, 1900, 32, 5, '2026-07-14 09:00:00', 9),
  (54, 'Liniment oléo-calcaire', 'Flacon 500ml', 3000, 4000, 15, 3, '2026-07-19 11:00:00', 9),

  -- Catégorie 10 : Snacks (55 à 60)
  (55, 'Chips nature 150g', 'Sachet de chips', 800, 1200, 22, 8, '2026-06-26 14:00:00', 10),
  (56, 'Chocolat noir 100g', 'Tablette 70%', 1000, 1500, 40, 7, '2026-06-29 11:00:00', 10),
  (57, 'Biscuits au chocolat', 'Paquet familial', 1200, 1700, 31, 6, '2026-07-04 15:00:00', 10),
  (58, 'Cacahuètes salées', 'Sachet 200g', 900, 1300, 27, 5, '2026-07-09 10:00:00', 10),
  (59, 'Bonbons gélifiés', 'Sachet 250g', 800, 1200, 31, 6, '2026-07-14 12:00:00', 10),
  (60, 'Barres céréales (x6)', 'Chocolat / amande', 1500, 2100, 30, 5, NOW(), 10);

-- =========================================================================
-- 3. MOUVEMENTS DE STOCK (150 mouvements du 26 juin 2026 à aujourd'hui)
-- =========================================================================
MERGE INTO mouvements_stock (id, type, quantite, motif, date_mouvement, produit_id) KEY(id) VALUES
  (1, 'ENTREE', 50, 'Stock initial', '2026-06-26 08:30:00', 1),
  (2, 'SORTIE', 5, 'Vente client', '2026-06-26 10:00:00', 1),
  (3, 'ENTREE', 40, 'Stock initial', '2026-06-27 09:15:00', 2),
  (4, 'SORTIE', 10, 'Vente client', '2026-06-27 14:20:00', 2),
  (5, 'ENTREE', 25, 'Stock initial', '2026-06-28 10:15:00', 3),
  (6, 'SORTIE', 3, 'Vente client', '2026-06-28 16:45:00', 3),
  (7, 'ENTREE', 20, 'Stock initial', '2026-06-26 11:00:00', 7),
  (8, 'SORTIE', 2, 'Vente client', '2026-06-26 15:30:00', 7),
  (9, 'ENTREE', 60, 'Stock initial', '2026-06-27 14:10:00', 8),
  (10, 'SORTIE', 15, 'Vente client', '2026-06-28 09:30:00', 8),
  (11, 'ENTREE', 30, 'Stock initial', '2026-06-26 14:15:00', 55),
  (12, 'SORTIE', 8, 'Vente client', '2026-06-27 11:20:00', 55),
  (13, 'ENTREE', 10, 'Stock initial', '2026-06-27 08:30:00', 49),
  (14, 'SORTIE', 2, 'Vente client', '2026-06-28 17:00:00', 49),
  (15, 'ENTREE', 20, 'Stock initial', '2026-06-26 11:15:00', 37),
  (16, 'SORTIE', 4, 'Vente client', '2026-06-29 10:40:00', 37),
  (17, 'ENTREE', 15, 'Approvisionnement', '2026-06-29 08:00:00', 4),
  (18, 'SORTIE', 5, 'Vente client', '2026-06-29 13:00:00', 4),
  (19, 'ENTREE', 30, 'Approvisionnement', '2026-06-30 09:10:00', 5),
  (20, 'SORTIE', 10, 'Vente client', '2026-06-30 16:20:00', 5),
  (21, 'ENTREE', 25, 'Approvisionnement', '2026-06-30 10:00:00', 9),
  (22, 'SORTIE', 5, 'Vente client', '2026-07-01 11:15:00', 9),
  (23, 'ENTREE', 40, 'Approvisionnement', '2026-06-30 09:30:00', 10),
  (24, 'SORTIE', 12, 'Vente client', '2026-07-01 14:00:00', 10),
  (25, 'ENTREE', 20, 'Approvisionnement', '2026-07-01 09:00:00', 6),
  (26, 'SORTIE', 8, 'Vente client', '2026-07-01 17:10:00', 6),
  (27, 'ENTREE', 50, 'Réassort', '2026-07-02 08:30:00', 1),
  (28, 'SORTIE', 20, 'Vente client', '2026-07-02 12:45:00', 1),
  (29, 'ENTREE', 10, 'Réassort', '2026-07-02 14:30:00', 13),
  (30, 'SORTIE', 7, 'Vente client', '2026-07-03 09:15:00', 13),
  (31, 'ENTREE', 20, 'Réassort', '2026-07-03 11:15:00', 14),
  (32, 'SORTIE', 5, 'Vente client', '2026-07-03 16:30:00', 14),
  (33, 'ENTREE', 30, 'Réassort', '2026-07-04 08:00:00', 11),
  (34, 'SORTIE', 10, 'Vente client', '2026-07-04 14:20:00', 11),
  (35, 'ENTREE', 25, 'Réassort', '2026-07-04 10:00:00', 12),
  (36, 'SORTIE', 8, 'Vente client', '2026-07-05 11:00:00', 12),
  (37, 'ENTREE', 15, 'Réassort', '2026-07-05 09:30:00', 15),
  (38, 'SORTIE', 6, 'Vente client', '2026-07-05 15:45:00', 15),
  (39, 'ENTREE', 40, 'Réassort', '2026-07-05 09:00:00', 2),
  (40, 'SORTIE', 15, 'Vente client', '2026-07-06 10:30:00', 2),
  (41, 'ENTREE', 30, 'Réassort', '2026-07-06 08:30:00', 17),
  (42, 'SORTIE', 10, 'Vente client', '2026-07-06 16:00:00', 17),
  (43, 'ENTREE', 20, 'Réassort', '2026-07-07 09:45:00', 18),
  (44, 'SORTIE', 11, 'Vente client', '2026-07-07 14:15:00', 18),
  (45, 'ENTREE', 25, 'Réassort', '2026-07-08 08:15:00', 19),
  (46, 'SORTIE', 10, 'Vente client', '2026-07-08 12:30:00', 19),
  (47, 'ENTREE', 20, 'Réassort', '2026-07-08 14:10:00', 42),
  (48, 'SORTIE', 8, 'Vente client', '2026-07-09 09:20:00', 42),
  (49, 'ENTREE', 15, 'Réassort', '2026-07-09 10:30:00', 20),
  (50, 'SORTIE', 7, 'Vente client', '2026-07-09 17:00:00', 20),
  (51, 'ENTREE', 20, 'Réassort', '2026-07-10 08:00:00', 21),
  (52, 'SORTIE', 9, 'Vente client', '2026-07-10 13:20:00', 21),
  (53, 'ENTREE', 25, 'Réassort', '2026-07-10 09:30:00', 51),
  (54, 'SORTIE', 17, 'Vente client', '2026-07-11 11:10:00', 51),
  (55, 'ENTREE', 20, 'Réassort', '2026-07-11 08:45:00', 22),
  (56, 'SORTIE', 10, 'Vente client', '2026-07-11 15:30:00', 22),
  (57, 'ENTREE', 35, 'Réassort', '2026-07-12 10:00:00', 23),
  (58, 'SORTIE', 12, 'Vente client', '2026-07-12 16:45:00', 23),
  (59, 'ENTREE', 15, 'Réassort', '2026-07-13 09:15:00', 24),
  (60, 'SORTIE', 6, 'Vente client', '2026-07-13 14:00:00', 24),
  (61, 'ENTREE', 30, 'Réassort', '2026-07-14 08:30:00', 25),
  (62, 'SORTIE', 18, 'Vente client', '2026-07-14 15:20:00', 25),
  (63, 'ENTREE', 25, 'Réassort', '2026-07-14 10:30:00', 53),
  (64, 'SORTIE', 9, 'Vente client', '2026-07-15 11:00:00', 53),
  (65, 'ENTREE', 25, 'Réassort', '2026-07-15 09:10:00', 26),
  (66, 'SORTIE', 10, 'Vente client', '2026-07-15 16:30:00', 26),
  (67, 'ENTREE', 40, 'Réassort', '2026-07-16 08:00:00', 27),
  (68, 'SORTIE', 15, 'Vente client', '2026-07-16 13:45:00', 27),
  (69, 'ENTREE', 20, 'Réassort', '2026-07-17 09:20:00', 28),
  (70, 'SORTIE', 7, 'Vente client', '2026-07-17 15:10:00', 28),
  (71, 'ENTREE', 25, 'Réassort', '2026-07-18 08:45:00', 29),
  (72, 'SORTIE', 10, 'Vente client', '2026-07-18 14:00:00', 29),
  (73, 'ENTREE', 30, 'Réassort', '2026-07-18 10:00:00', 48),
  (74, 'SORTIE', 24, 'Vente client', '2026-07-19 11:30:00', 48),
  (75, 'ENTREE', 25, 'Réassort', '2026-07-19 09:15:00', 30),
  (76, 'SORTIE', 10, 'Vente client', '2026-07-19 16:20:00', 30),
  (77, 'ENTREE', 20, 'Réassort', '2026-07-20 07:30:00', 31),
  (78, 'SORTIE', 12, 'Vente client', '2026-07-20 12:00:00', 31),
  (79, 'ENTREE', 30, 'Réassort', '2026-07-20 09:00:00', 32),
  (80, 'SORTIE', 15, 'Vente client', '2026-07-20 17:10:00', 32),
  (81, 'ENTREE', 15, 'Réassort', '2026-07-21 07:15:00', 33),
  (82, 'SORTIE', 12, 'Vente client', '2026-07-21 11:30:00', 33),
  (83, 'ENTREE', 15, 'Réassort', '2026-07-21 08:30:00', 34),
  (84, 'SORTIE', 9, 'Vente client', '2026-07-21 15:45:00', 34),
  (85, 'ENTREE', 25, 'Réassort', '2026-07-22 09:00:00', 35),
  (86, 'SORTIE', 14, 'Vente client', '2026-07-22 14:20:00', 35),
  (87, 'ENTREE', 20, 'Réassort', '2026-07-22 10:15:00', 36),
  (88, 'SORTIE', 9, 'Vente client', '2026-07-22 16:30:00', 36),
  (89, 'ENTREE', 40, 'Réassort', '2026-07-23 08:30:00', 3),
  (90, 'SORTIE', 25, 'Vente client', '2026-07-23 13:10:00', 3),
  (91, 'ENTREE', 25, 'Réassort', '2026-07-23 10:00:00', 38),
  (92, 'SORTIE', 15, 'Vente client', '2026-07-23 17:00:00', 38),
  (93, 'ENTREE', 35, 'Réassort', '2026-07-24 08:00:00', 39),
  (94, 'SORTIE', 12, 'Vente client', '2026-07-24 11:45:00', 39),
  (95, 'ENTREE', 30, 'Réassort', '2026-07-24 09:30:00', 40),
  (96, 'SORTIE', 14, 'Vente client', '2026-07-24 15:20:00', 40),
  (97, 'ENTREE', 30, 'Réassort', '2026-07-25 08:45:00', 41),
  (98, 'SORTIE', 16, 'Vente client', '2026-07-25 12:30:00', 41),
  (99, 'ENTREE', 25, 'Réassort', '2026-07-25 10:00:00', 43),
  (100, 'SORTIE', 18, 'Vente client', '2026-07-25 16:15:00', 43),
  (101, 'ENTREE', 20, 'Réassort', '2026-07-26 07:30:00', 44),
  (102, 'SORTIE', 14, 'Vente client', '2026-07-26 10:00:00', 44),
  (103, 'ENTREE', 15, 'Réassort', '2026-07-26 08:00:00', 45),
  (104, 'SORTIE', 11, 'Vente client', '2026-07-26 11:15:00', 45);

-- =========================================================================
-- 4. RESTART DES SEQUENCES H2
-- =========================================================================
ALTER TABLE categories ALTER COLUMN id RESTART WITH 200;
ALTER TABLE produits ALTER COLUMN id RESTART WITH 200;
ALTER TABLE mouvements_stock ALTER COLUMN id RESTART WITH 200;