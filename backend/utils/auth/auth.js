import { verifyToken } from "./jwt.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      message: "No token provided Please login",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again",
      });
    }

    return res.status(401).json({
      message: "Invalid token",
      error: err.message,
    });
  }
};

export const requireSelf = (req, res, next) => {
  const userIdFromToken = req.user.id;
  const targetId = Number(req.params.id);

  if (userIdFromToken !== targetId) {
    return res.status(403).json({
      message: "You can only access your own account",
    });
  }

  next();
};
