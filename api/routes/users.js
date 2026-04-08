import express from "express";
import { query } from "../db-repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const results = await query(
            "SELECT id, username, name, surname, pronouns, creation_time FROM account WHERE is_deleted = 0 ORDER BY surname ASC"
        );

        res.status(200).json(results);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const userResult = await query(
            "SELECT id, username, name, surname, pronouns, creation_time FROM account WHERE id = ? AND is_deleted = 0",
            [id]
        );

        if (userResult.length === 0) {
            return res.status(404).send("User not found");
        }

        const ownArticles = await query(`
            SELECT 
                a.id, a.title, a.content, a.creation_time, a.image_path,
                acc.id AS author_id, acc.username, acc.name, acc.surname,
                COUNT(DISTINCT r.id) AS reaction_count
            FROM article a
            JOIN account acc ON a.author_id = acc.id
            LEFT JOIN reaction r ON a.id = r.article_id
            WHERE a.author_id = ? AND a.is_deleted = 0
            GROUP BY a.id
            ORDER BY a.creation_time DESC
        `, [id]);

        const interactedArticles = await query(`
            SELECT DISTINCT
                a.id, a.title, a.content, a.creation_time, a.image_path,
                acc.id AS author_id, acc.username, acc.name, acc.surname,
                COUNT(DISTINCT r.id) AS reaction_count
            FROM article a
            JOIN account acc ON a.author_id = acc.id
            LEFT JOIN reaction r ON a.id = r.article_id
            WHERE a.is_deleted = 0 AND a.author_id != ?
              AND (
                  EXISTS (SELECT 1 FROM reaction WHERE article_id = a.id AND account_id = ?)
                  OR EXISTS (SELECT 1 FROM reply WHERE article_id = a.id AND is_deleted = 0)
              )
            GROUP BY a.id
            ORDER BY a.creation_time DESC
        `, [id, id]);

        res.status(200).json({
            user: userResult[0],
            own_articles: ownArticles,
            interacted_articles: interactedArticles
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default router;