class Alumne {
    constructor(id, nom, cognom, anys, cicle, moduls, notes) {
        this.id = id;
        this.nom = nom;
        this.cognom = cognom;
        this.anys = anys;
        this.cicle = cicle;
        this.moduls = moduls;
        this.notes = notes || []; 
    }
}

module.exports = Alumne;