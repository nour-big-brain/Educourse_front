export class Cours {
  idCours: number;
  titre_cours: string;
  duree_cours: number;
  materials: string[];
  image!: File | null;

  constructor() {
    this.idCours = 0;
    this.titre_cours = '';
    this.duree_cours = 0;
    this.materials = [];
  }
}