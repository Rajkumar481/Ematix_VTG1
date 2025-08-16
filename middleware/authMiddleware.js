import { verifyJWT } from "../utils/tokenUitls.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  console.log(token, " token in authMiddleware");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const { userId } = verifyJWT(token);
    console.log(userId);

    req.user = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
