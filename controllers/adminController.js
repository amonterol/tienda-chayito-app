const Product = require("../models/product");
const { validationResult } = require("express-validator");
const ITEMS_PER_PAGE = 2;

exports.getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    errorMessage: message,
    oldInput: {
      title: "",
      sku: "",
      imageUrl: "",
      price: "",
      category: "",
      subcategory: "",
      description: "",
    },
    validationErrors: [],
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const sku = req.body.sku;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        sku: sku,
        imageUrl: imageUrl,
        price: price,
        category: category,
        subcategory: subcategory,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    sku: sku,
    imageUrl: imageUrl,
    price: price,
    category: category,
    subcategory: subcategory,
    description: description,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      //First way to handle errors
      //   return res.status(500).render("admin/add-product", {
      //     pageTitle: "Add Product",
      //     path: "/admin/add-product",
      //     errorMessage: "Se produjo un fallo en la conexión con la base de datos, por favor inténtelo nuevamente!",
      //     oldInput: {
      //       title: title,
      //       sku: sku,
      //       imageUrl: imageUrl,
      //       price: price,
      //       category: category,
      //       subcategory: subcategory,
      //       description: description,
      //     },
      //     validationErrors: [],
      //   });
      // });
      //or
      //Second way to handle errors
      //res.redirect("/500");
      //or
      //Third way to handle errors
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  /*
  let message = req.flash("error");
  
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  */

  let message = null;

  //Traemos las caracteristicas del producto desde la base de datos usando el id
  const prodId = req.params.productId;
  console.log(`Este es el producto a editar ${prodId}`);

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      console.log(`Este es el precio del producto a editar ${product.price}`);
      console.log(`Este es el precio del producto a editar ${product.title}`);
      console.log(`Este es el precio del producto a editar ${product.sku}`);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: {
          title: product.title.trim(),
          sku: product.sku.trim(),
          imageUrl: product.imageUrl.trim(),
          price: product.price.toString().trim(),
          category: product.category.trim(),
          subcategory: product.subcategory.trim(),
          description: product.description.trim(),
          _id: prodId,
        },

        //nuevo
        hasError: false,
        errorMessage: null,
        //isAuthenticated: req.session.isLoggedIn,
        validationErrors: [],

        //termina nuevo
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = async (req, res) => {
  //Capturamos los cambios realizados por el usuario
  const prodId = req.body.productId;

  try {
    const { title, sku, imageUrl, price, category, subcategory, description } =
      req.body;

    console.log(`Despues de editar el producto productId es ${prodId}`);
    console.log(`Despues de editar el precio del producto es ${title}`);
    console.log(`Despues de editar el sku del producto es ${sku}`);

    //inicia nuevo

    //Verificamos si hay errores de validacion
    const errors = validationResult(req);
    //si hay errores de validation mostramos nuevamente los nuevo datos ingresados
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        hasError: true,
        oldInput: {
          title: title,
          sku: sku,
          imageUrl: imageUrl,
          price: price,
          category: category,
          subcategory: subcategory,
          description: description,
          _id: prodId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    //termina nuevo

    //si no hay errores de validacion y se encontro el producto  guardamos las modificaciones
    // id = prodId.toString();
    let doc = await Product.findOneAndUpdate(
      { _id: String(prodId).trim() },
      {
        title: title,
        sku: sku,
        imageUrl: imageUrl,
        price: price,
        category: category,
        subcategory: subcategory,
        description: description,
      }
    );
    console.log(`El producto ${doc._id} ha sido actualizado`);
    console.log(`El producto ${doc.title} ha sido actualizado`);
    //res.json({ msg: `El producto ${prodId} ha sido actualizado` });
    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/products");
  } catch (err) {
    // return res.status(500).json({ msg: err.message });
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      console.log(products);
      res.render("admin/products-list", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        //isAuthenticated: req.session.isLoggedIn,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(`getDeleteProduct Id de producto a eliminadr ${prodId}`);
  console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/delete-product", {
        pageTitle: "Edit Product",
        path: "/admin/delete-product",
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    console.log(` postDeleteProduct ${prodId}`);
    let doc = await Product.findByIdAndDelete({ _id: prodId });
    console.log(`Producto eliminado ${doc._id}`);
    //res.json({ msg: "Deleted a Product" });
    console.log("UPDATED PRODUCT!");
    res.redirect("/admin/products");
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

/*


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
*/

/*
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedCategory = req.body.category;
  const updatedSubCategory = req.body.subcategory;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        console.log("NO UPDATED PRODUCT!");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.category = updatedCategory;
      product.subcategory = updatedSubCategory;
      product.description = updatedDesc;

      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
*/
