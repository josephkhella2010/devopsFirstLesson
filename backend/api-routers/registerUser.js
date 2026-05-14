import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

router.post("/add-new-user", async (req, res) => {
  try {
    const cleanString = (value, toLower = false) => {
      if (typeof value !== "string") return "";
      let cleaned = value.trim().replace(/\s+/g, " ");
      return toLower ? cleaned.toLowerCase() : cleaned;
    };

    const username = cleanString(req.body.username, true);
    const email = cleanString(req.body.email, true);
    const password = req.body.password?.trim();

    const fields = { username, email, password };

    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          message: `${key} field is required`,
        });
      }
    }
    const existUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existUser) {
      return res.status(500).json({
        message: "User is already exist Please login",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const addNewUser = await prisma.user.create({
      data: {
        ...fields,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "successfully added User",
      addNewUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error with add User Request",
      error: err.message,
    });
  }
});

export default router;
