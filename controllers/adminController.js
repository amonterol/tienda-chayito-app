const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const product_id = req.body.product_id;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const category = req.body.category;
  const subcategory = req.body.subcategory;
  const description = req.body.description;

  const product = new Product({
    title: title,
    product_id: product_id,
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
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
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

exports.postEditProduct = async (req, res) => {
  const prodId = req.body.productId;
  try {
    const { title, price, imageUrl, category, subcategory, description } =
      req.body;
    console.log("postEditProduct");
    console.log(prodId);
    console.log(title);
    //if (!imageUrl) return res.status(400).json({ msg: "No image upload" });
    //const filter = { name: 'Jean-Luc Picard' };
    //const update = { age: 59 };

    let doc = await Product.findOneAndUpdate(
      { _id: prodId },
      {
        title: title.toLowerCase(),
        price,
        imageUrl,
        category,
        subcategory,
        description,
      }
    );
    console.log(doc._id);
    res.json({ msg: "Updated a Product" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getProducts = (req, res, next) => {
  Product.find()
    //.select("title price -_id")
    //.populate("userId", "name")
    .then((products) => {
      console.log(products);
      res.render("admin/products-list", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    console.log(` postDeleteProduct ${prodId}`);
    let doc = await Product.findByIdAndDelete({ _id: prodId });
    console.log(`Producto eliminado ${doc._id}`);
    res.json({ msg: "Deleted a Product" });
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
