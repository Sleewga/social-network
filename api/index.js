import express from 'express'
import cors from 'cors'

const PORT = 4200;
const app = express();

app.use(express.json());
app.use(cors());