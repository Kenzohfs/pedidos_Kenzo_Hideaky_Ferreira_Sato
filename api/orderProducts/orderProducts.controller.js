const express = require("express");
const router = express.Router();

const orderProductsHandler = require("./orderProducts.handler");

router.get("/", async (req, res) => {
    res.json(await orderProductsHandler.getOrderProducts().catch(error => {
        res.status(404).json(error);
    }));
});

router.get("/:id", async (req, res) => {
    res.json(await orderProductsHandler.getOrderProduct(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

router.post("/", async (req, res) => {
    res.json(await orderProductsHandler.saveOrderProduct(req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.put("/:id", async (req, res) => {
    res.json(await orderProductsHandler.updateOrderProduct(req.params.id, req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.delete("/:id", async (req, res) => {
    res.json(await orderProductsHandler.deleteOrderProduct(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

module.exports = router;