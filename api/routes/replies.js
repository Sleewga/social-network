import express from "express";
import { query } from "../db-repository.js";

const router = express.Router();

router.get("/:article_id", async (req, res) => {
    const { article_id } = req.params;

    try {
        const results = await query(`
            SELECT 
                rep.id, rep.content, rep.creation_time, rep.parent_id,
                acc.id AS author_id, acc.username, acc.name, acc.surname
            FROM reply rep
            JOIN account acc ON rep.article_id = ?
            WHERE rep.article_id = ? AND rep.is_deleted = 0
            ORDER BY rep.creation_time DESC
        `, [article_id, article_id]);

        res.status(200).json(results);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { article_id, author_id, content, parent_id } = req.body;

    if (!article_id || !author_id || !content) {
        return res.status(400).send("article_id, author_id and content are required");
    }

    try {
        const result = await query(
            "INSERT INTO reply (article_id, parent_id, content, creation_time, is_deleted) VALUES (?, ?, ?, NOW(), 0)",
            [article_id, parent_id || null, content]
        );

        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await query("UPDATE reply SET is_deleted = 1 WHERE id = ?", [id]);
        res.status(200).send("Reply deleted");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default router;