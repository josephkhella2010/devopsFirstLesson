import express from "express";
import dotenv from "dotenv";
import getUsers from "./api-routers/getUsers.js";
import registerUser from "./api-routers/registerUser.js";
import deleteUser from "./api-routers/deleteUser.js";
import loginUser from "./api-routers/loginUser.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello docker welcome back");
});

app.use("/api", getUsers);
app.use("/api", registerUser);
app.use("/api", deleteUser);
app.use("/api", loginUser);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
