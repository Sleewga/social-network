import express from "express";
import { query } from "../db-repository.js";

const router = express.Router();

router.get("/:article_id", async (req, res) => {
    const { article_id } = req.params;

    try {
        const results = await query(`
            SELECT acc.id, acc.username, acc.name, acc.surname
            FROM reaction r
            JOIN account acc ON r.account_id = acc.id
            WHERE r.article_id = ?
        `, [article_id]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { article_id, account_id } = req.body;

    if (!article_id || !account_id) {
        return res.status(400).send("article_id and account_id are required");
    }

    try {
        await query(
            "INSERT INTO reaction (article_id, account_id) VALUES (?, ?)",
            [article_id, account_id]
        );

        res.status(201).send("Reaction added");
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).send("Already liked");
        }
        res.status(500).send("Server error");
    }
});

router.delete("/", async (req, res) => {
    const { article_id, account_id } = req.body;

    if (!article_id || !account_id) {
        return res.status(400).send("article_id and account_id are required");
    }

    try {
        await query(
            "DELETE FROM reaction WHERE article_id = ? AND account_id = ?",
            [article_id, account_id]
        );

        res.status(200).send("Reaction removed");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default router;