const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const verifyToken = (req, res, next) => {
  const token =req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication!!!");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;