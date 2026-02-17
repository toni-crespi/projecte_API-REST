const fs = require('fs');
const path = require('path');
const Alumne = require('../models/alumne'); 
const dataPath = path.join(__dirname, '../data/alumnes.json');

const getAlumnesFromDB = () => {
    try {
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const alumnesJson = JSON.parse(rawData);

        return alumnesJson.map(a => 
            new Alumne(
                a.id,
                a.nom || a.name,           
                a.cognom || a.surname,     
                a.anys || a.age,           
                a.cicle || a.course,       
                a.moduls || a.modules,     
                a.notes || a.grades || []  
            )
        );
    } catch (error) {
        console.error("Error llegint JSON:", error);
        return [];
    }
};

// 1. REQUISIT: Llistar tot i Filtrar per nom (Query parameter)
exports.llistaAlumnes = (req, res) => {
    let alumnes = getAlumnesFromDB();
    const { nom } = req.query; // Captura el ?nom= de la URL

    if (nom) {
        // Filtrem per nom si l'usuari el posa a la URL
        alumnes = alumnes.filter(a => a.nom.toLowerCase() === nom.toLowerCase());
    }

    res.json(alumnes);
};

// 2. REQUISIT: Recuperar dades per ID (Path parameter)
exports.getAlumneById = (req, res) => {
    const alumnes = getAlumnesFromDB();
    const idParam = parseInt(req.params.id); 
    
    const alumne = alumnes.find(a => a.id === idParam);

    if (alumne) {
        res.json(alumne);
    } else {
        res.status(404).json({ message: "Alumne no trobat" });
    }
};

// 3. Altres rutes que ja tenies (IAW i Notes)
exports.llistaAlumnesMatriculatsIAW = (req, res) => {
    const alumnes = getAlumnesFromDB();
    const alumnesFiltrats = alumnes.filter(alumne => 
        alumne.cicle === "IFC31-C" && alumne.moduls.includes("IAW")
    );
    res.json(alumnesFiltrats);
};

exports.calcularNotes = (req, res) => {
    let inputStudents = req.body;
    if (!Array.isArray(inputStudents) || inputStudents.length === 0) {
        inputStudents = getAlumnesFromDB();
    }

    const results = inputStudents.map(student => {
        const notes = student.notes || student.grades || [];
        const sum = notes.reduce((a, b) => a + b, 0);
        const avg = notes.length > 0 ? (sum / notes.length) : 0;

        return {
            student: `${student.cognom}, ${student.nom}`, 
            finalMark: parseFloat(avg.toFixed(2))
        };
    });

    results.sort((a, b) => a.student.localeCompare(b.student));
    res.json(results);
};