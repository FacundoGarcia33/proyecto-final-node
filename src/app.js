const express = require('express');
const productsRouter = require('./routes/routerProducts.js');

const app = express();
const PORT = 8080;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter); // Configura el router de productos

// Mensaje para rutas no definidas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Escuchar en el puerto 8080
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
