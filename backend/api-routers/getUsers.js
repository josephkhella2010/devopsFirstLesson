import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({ message: "successfully get Users", users });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error with get User Request", error: err.message });
  }
});

export default router;
