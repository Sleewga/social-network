import express from "express";
import { query } from "../db-repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { user_id } = req.query;
    try {
        const results = await query(`
            SELECT 
                a.id, a.title, a.content, a.creation_time, a.image_path,
                acc.id AS author_id, acc.username, acc.name, acc.surname,
                COUNT(DISTINCT r.id) AS reaction_count,
                MAX(CASE WHEN r.account_id = ? THEN 1 ELSE 0 END) AS user_liked
            FROM article a
            JOIN account acc ON a.author_id = acc.id
            LEFT JOIN reaction r ON a.id = r.article_id
            WHERE a.is_deleted = 0
            GROUP BY a.id
            ORDER BY a.creation_time DESC
        `, [user_id || null]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.query;
    try {
        const results = await query(`
            SELECT 
                a.id, a.title, a.content, a.creation_time, a.image_path,
                acc.id AS author_id, acc.username, acc.name, acc.surname,
                COUNT(DISTINCT r.id) AS reaction_count,
                MAX(CASE WHEN r.account_id = ? THEN 1 ELSE 0 END) AS user_liked
            FROM article a
            JOIN account acc ON a.author_id = acc.id
            LEFT JOIN reaction r ON a.id = r.article_id
            WHERE a.id = ? AND a.is_deleted = 0
            GROUP BY a.id
        `, [user_id || null, id]);
        if (results.length === 0) return res.status(404).send("Not found");
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { author_id, title, content, image_path } = req.body;
    if (!author_id || !title || !content) {
        return res.status(400).send("author_id, title and content are required");
    }
    try {
        const result = await query(
            "INSERT INTO article (author_id, title, content, creation_time, image_path, is_deleted) VALUES (?, ?, ?, NOW(), ?, 0)",
            [author_id, title, content, image_path || null]
        );
        // Important: Return the ID so frontend can fetch the full post object
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { author_id } = req.query; 
    try {
        await query(
            "UPDATE article SET is_deleted = 1 WHERE id = ? AND author_id = ?",
            [id, author_id]
        );
        res.status(200).send("Article deleted");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default router;