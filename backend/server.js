import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello docker how are u ");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
