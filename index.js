require("dotenv").config();

//Paquetes de terceros
const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require("./controllers/errorController");
const csrf = require("csurf");
const flash = require("connect-flash");

//Importamos las routes de la aplicacion
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

//Inicializamos variables requeridas
const port = 3000;
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

/**
 * Saco a mi usuario de la sesión y luego encontrar el usuario por ID en una base de datos
 *  y luego almaceno el usuario encontrado en mi objeto de req
 * para que durante toda la solicitud, pueda acceder a ese objeto de usuario,
 * user es un  objeto del modelo definido para utilizar en mongoose  y
 * se captura cualquier errore potencial que podria ocurrir
 * en el proceso, tales como que la base de datos no este disponible o
 * el usuario no tenga los privilegios adecuados.
 */
app.use((req, res, next) => {
  //throw new Error("Dummy error  inside a Sync function not a promise function!");
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      //throw new Error("Dummy error  inside a async function or promise!");
      if (!user) {
        return next();
      }
      console.log(`En el Index.js  el usuario es> ${user._id}`);
      req.user = user;
      next();
    })
    .catch((err) => {
      //throw new Error(err); This no work!
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500Page);

app.use(errorController.get404Page);

//Error handle middleware
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// Connect to mongodb
const uri = process.env.MONGODB_URL;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
