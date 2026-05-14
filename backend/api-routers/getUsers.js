import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
