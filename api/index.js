import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/articles.js";
import userRoutes from "./routes/users.js";
import reactionRoutes from "./routes/reactions.js";
import replyRoutes from "./routes/replies.js";

const PORT = 4200;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/users", userRoutes);
app.use("/reactions", reactionRoutes);
app.use("/replies", replyRoutes);

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});