import express from "express";
import { query } from "../db-repository.js";
 
const router = express.Router();
 
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
 
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
 
    try {
        const results = await query(
            "SELECT id, username, name, surname FROM account WHERE username = ? AND password_hash = ? AND is_deleted = 0",
            [username, password]
        );
 
        if (results.length === 0) {
            return res.status(401).send("Invalid credentials");
        }
 
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).send("Server error");
    }
});
 
router.post("/register", async (req, res) => {
    const { username, password, name, surname, pronouns } = req.body;
 
    if (!username || !password || !pronouns) {
        return res.status(400).send("Username, password and pronouns are required");
    }
 
    try {
        await query(
            "INSERT INTO account (username, name, surname, pronouns, password_hash, creation_time, is_deleted) VALUES (?, ?, ?, ?, ?, NOW(), 0)",
            [username, name, surname, pronouns, password]
        );
 
        res.status(201).send("Account created");
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).send("Username already taken");
        }
        res.status(500).send("Server error");
    }
});
 
export default router;