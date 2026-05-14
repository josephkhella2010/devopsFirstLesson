import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

router.post("/login-user", async (req, res) => {
  try {
    function cleanString(value, isLower) {
      if (typeof value !== "string") {
        return "";
      }
      let Name = value.trim().replace(/\s+/g, " ");
      const cleaned = !isLower ? Name.toLowerCase() : Name;
      return cleaned;
    }

    const password = req.body.password?.trim();
    const usernameOrEmail = cleanString(req.body.username || req.body.email);

    const fields = { usernameOrEmail, password };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          message:
            key === "usernameOrEmail"
              ? "username or email is required"
              : `${key} is require`,
        });
      }
    }
    const findUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const passwordIsMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordIsMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      message: "successfully logged in User",
      user: findUser,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(500).json({
      message: "error with login  User Request",
      error: err.message,
    });
  }
});

export default router;
