export class Examen {
    idEx!:number;
    titre:string;
    date_ex: string;
    note: number;
  
    // constructor(date_ex: string, note: number) {
    //   this.date_ex = date_ex;
    //   this.note = note;
    // }
    constructor(){
      this.date_ex="";
      this.titre="";
      this.note=0;
    }
  }
  