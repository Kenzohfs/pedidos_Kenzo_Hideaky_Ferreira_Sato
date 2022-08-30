const express = require("express");
const router = express.Router();

const usersHandler = require("./users.handler");

router.get("/", async (req, res) => {
    res.json(await usersHandler.getUsers().catch(error => {
        res.json("Error: ", error);
    }));
});

router.get("/:id", async (req, res) => {
    res.json(await usersHandler.getUser(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

router.post("/", async (req, res) => {
    res.json(await usersHandler.saveUser(req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.put("/:id", async (req, res) => {
    res.json(await usersHandler.updateUser(req.params.id, req.body).catch(error => {
        res.status(404).json(error);
    }));
});

router.delete("/:id", async (req, res) => {
    res.json(await usersHandler.deleteUser(req.params.id).catch(error => {
        res.status(404).json(error);
    }));
});

module.exports = router;