//Cuando tratamos de ingresar a algo que para el que necesitamos esta loggedin
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};
