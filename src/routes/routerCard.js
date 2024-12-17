const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Rutas de archivos JSON
const cartsFilePath = path.join(__dirname, '../data/carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para leer archivos JSON
const readJSON = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
        console.error(`Error al leer el archivo ${filePath}:`, err);
        return [];
    }
};

// Función para escribir en archivos JSON
const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// GET /api/carts/:cid → Listar los productos del carrito
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readJSON(cartsFilePath);

    // Buscar el carrito por su ID
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) {
        return res.status(404).json({ message: `Carrito con ID ${cid} no encontrado.` });
    }

    res.json({ message: `Productos del carrito ${cid}:`, products: cart.products });
});

// POST /api/carts/:cid/product/:pid → Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;

    // Leer datos desde los archivos JSON
    const carts = readJSON(cartsFilePath);
    const products = readJSON(productsFilePath);

    // Buscar carrito y producto
    const cart = carts.find(c => c.id === parseInt(cid));
    const product = products.find(p => p.id === parseInt(pid));

    if (!cart) {
        return res.status(404).json({ message: `Carrito con ID ${cid} no encontrado.` });
    }

    if (!product) {
        return res.status(404).json({ message: `Producto con ID ${pid} no encontrado.` });
    }

    // Buscar si el producto ya existe en el carrito
    const existingProduct = cart.products.find(p => p.product === parseInt(pid));

    if (existingProduct) {
        // Incrementar la cantidad si el producto ya existe
        existingProduct.quantity += 1;
    } else {
        // Agregar el producto al carrito con quantity 1
        cart.products.push({ product: parseInt(pid), quantity: 1 });
    }

    // Guardar cambios en el archivo carts.json
    writeJSON(cartsFilePath, carts);

    res.json({ message: `Producto ${pid} agregado al carrito ${cid}.`, cart });
});

module.exports = router;
