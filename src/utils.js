import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PORT = 8080;
const JWT_PRIVATE_KEY = "DiegoSepulvedaCoder";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, `${__dirname}/public/images/products`);
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

const uploader = multer({ storage });

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "1d" });
  return token;
};

const authToken = (request, response, next) => {
  const authHeader = request.header.authorization;
  if (!authHeader) {
    return response
      .status(401)
      .send({ status: `error`, error: `No autenticado` });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_PRIVATE_KEY, (error, credentials) => {
    if (error)
      return response
        .status(403)
        .send({ status: `error`, error: `Wrong Header Token` });
    request.user = credentials.user;
    next();
  });
};

export {
  __dirname,
  PORT,
  uploader,
  createHash,
  isValidPassword,
  authToken,
  generateToken,
  JWT_PRIVATE_KEY,
};
