import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/view.router.js";
import sessionRouter from "./routes/session.router.js";
import handlebars from "express-handlebars";
import express from "express";
import cors from "cors";
import { __dirname, PORT } from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
// import MongoStore from "connect-mongo";
// import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express();

try {
  mongoose.connect(
    `mongodb+srv://diegosepu:2hQM9Rr3XUvfbwMs@cluster1ds.czhv5gd.mongodb.net/?retryWrites=true&w=majority`
  );
  console.log(`Base de datos conectada`);
} catch (error) {
  console.log(error.message);
}

// app.use(
//   session({
//     store: MongoStore.create({
//       client: mongoose.connection.getClient(),
//       mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
//     }),
//     secret: "CoderSecret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

initializePassport();

app.use(passport.initialize());
// app.use(passport.session());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const socketio = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

const io = new Server(socketio);
app.set("socketio", io);
