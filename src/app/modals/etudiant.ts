import { Certificat } from "./certificat";
import { Cours } from "./cours";
import { Exam } from "./exam";


export class Etudiant {
  idEtud?: number;
  nomEtud?: string;
  emailEtud?: string;
  password?: string;
  dateNaissance?: Date;
  niveau?: string;
  role?: string;
  cours?: Cours;
  examens?: Exam[];
  certificats?: Certificat[];
}
