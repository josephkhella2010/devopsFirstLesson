import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../utils/auth/auth.js";
import { requireSelf } from "../utils/auth/auth.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = express.Router();

router.put("/update-user/:id", auth, requireSelf, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    function cleanString(value, isLower) {
      if (typeof value !== "string") return "";
      let name = value.trim().replace(/\s+/g, " ");
      return isLower ? name.toLowerCase() : name;
    }

    const username = cleanString(req.body.username, true);
    const email = cleanString(req.body.email, true);
    const password = req.body.password;

    // CHECK DUPLICATES
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : []),
        ],
        NOT: {
          id: userId,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // HASH PASSWORD
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // UPDATE USER
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    const allUser = await prisma.user.findMany();

    return res.status(200).json({
      message: "user successfully updated",
      user: updateUser,
      users: allUser,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(500).json({
      message: "error updating user request",
      error: error.message,
    });
  }
});

export default router;
