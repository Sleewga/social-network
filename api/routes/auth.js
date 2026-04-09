import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db-repository.js";

const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = "tajny_klic_123";

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    try {
        const results = await query(
            "SELECT id, username, name, surname, password_hash FROM account WHERE username = ? AND is_deleted = 0",
            [username]
        );

        if (results.length === 0) {
            return res.status(401).send("Invalid credentials");
        }

        const match = await bcrypt.compare(password, results[0].password_hash);
        if (!match) {
            return res.status(401).send("Invalid credentials");
        }

        const user = { id: results[0].id, username: results[0].username, name: results[0].name, surname: results[0].surname };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ user, token });
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
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        await query(
            "INSERT INTO account (username, name, surname, pronouns, password_hash, creation_time, is_deleted) VALUES (?, ?, ?, ?, ?, NOW(), 0)",
            [username, name, surname, pronouns, hash]
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