import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import articlesRouter from "./routes/articles.js";
import repliesRouter from "./routes/replies.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import reactionsRouter from "./routes/reactions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'images/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);
app.use("/replies", repliesRouter);
app.use("/users", usersRouter);
app.use("/reactions", reactionsRouter);

app.post("/upload", upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded");
    res.status(200).json({ filePath: req.file.filename });
});

app.listen(4200, () => console.log("Running on http://localhost:4200"));