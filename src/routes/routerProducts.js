const express = require('express');
const router = express.Router();
const products = require('../data/products'); 
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const generateUniqueId = () => {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
};

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    const productIndex = products.findIndex(p => p.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).json({ message: `Producto con ID ${pid} no encontrado` });
    }

    if (updatedFields.id) {
        delete updatedFields.id;
    }

    products[productIndex] = { ...products[productIndex], ...updatedFields };

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el producto', error: err });
        }
        res.json({ message: 'Producto actualizado correctamente', product: products[productIndex] });
    });
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    const productIndex = products.findIndex(p => p.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).json({ message: `Producto con ID ${pid} no encontrado` });
    }

    const deletedProduct = products.splice(productIndex, 1);

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el producto', error: err });
        }
        res.json({ message: 'Producto eliminado correctamente', product: deletedProduct[0] });
    });
});

module.exports = router;
