const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const alumneRoutes = require('./routes/alumne-routes');

app.use('/api/alumnes', alumneRoutes);

app.get('/', (req, res) => {
    res.send('API REST seguint guia UT2 funcionant! ');
});

app.listen(port, () => {
    console.log(`Servidor escoltant a http://localhost:${port}`);
});