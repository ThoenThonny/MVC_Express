import express from 'express'
import cors from 'cors'
import studenRoutes from "./routes/studentRoutes.js"

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Fixed
app.use(express.urlencoded({ extended: true })); // ✅ Added
app.use("/students",studenRoutes)

app.listen(4000, () => console.log("Server running on http://localhost:4000/students"));