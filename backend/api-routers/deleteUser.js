import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../utils/auth/auth.js";
import { requireSelf } from "../utils/auth/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.delete("/delete-user/:id", auth, requireSelf, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "id is require",
      });
    }
    const userId = Number(id);

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    const restUsers = await prisma.user.findMany();

    return res.status(200).json({
      message: "successfully deleted User",
      deletedUser,
      restUsers,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(500).json({
      message: "error with delete User Request",
      error: err.message,
    });
  }
});

export default router;
