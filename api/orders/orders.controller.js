const express = require("express");
const router = express.Router();

const ordersHandler = require("./orders.handler");

router.get("/", async (req, res) => {
    res.json(await ordersHandler.getOrders().catch(error => {
        res.status(404).json(error);
    }));
});

router.get("/:id", async (req, res) => {
    res.json(await ordersHandler.getOrder(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

router.post("/", async (req, res) => {
    res.json(await ordersHandler.saveOrder(req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.put("/:id", async (req, res) => {
    res.json(await ordersHandler.updateOrder(req.params.id, req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.delete("/:id", async (req, res) => {
    res.json(await ordersHandler.deleteOrder(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

module.exports = router;