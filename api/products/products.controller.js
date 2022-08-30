const express = require("express");
const router = express.Router();

const productsHandler = require("./products.handler");

router.get("/", async (req, res) => {
    res.json(await productsHandler.getProducts().catch(error => {
        res.status(404).json(error);
    }));
});

router.get("/:id", async (req, res) => {
    res.json(await productsHandler.getProduct(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

router.post("/", async (req, res) => {
    res.json(await productsHandler.saveProduct(req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.put("/:id", async (req, res) => {
    res.json(await productsHandler.updateProduct(req.params.id, req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.delete("/:id", async (req, res) => {
    res.json(await productsHandler.deleteProduct(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

module.exports = router;