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


exports.llistaAlumnes = (req, res) => {
    const alumnes = getAlumnesFromDB();
    res.json(alumnes);
};


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