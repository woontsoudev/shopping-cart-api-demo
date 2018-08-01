const Product = require("../models/product");

exports.createProduct = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(url)
  const product = new Product({
    name: req.body.name,
    detail: req.body.detail,
    creator: req.userData.userId,
    quantity: req.body.quantity,
    // imagePath: url + "/images/" + req.file.filename,
  });
  product
    .save()
    .then(createdProduct => {
      res.status(201).json({
        message: "Product added successfully",
        product: {
          ...createdProduct._doc,
          _id: createdProduct._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a product failed!"
      });
    });
};

exports.updateProduct = (req, res, next) => {
  // let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    detail: req.body.detail,
    //   imagePath: imagePath,
    creator: req.userData.userId
  });
  Product.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    product
  )
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate product!"
      });
    });
};

exports.checkoutProducts = (req, res, next) => {
  let responseStatus;
  req.body.forEach(product => {
    let productQuantity = product.quantity - product.inCartQuantity;

    let productToUpdate = new Product({
      _id: product._id,
      name: product.name,
      detail: product.detail,
      creator: product.userId,
      quantity: product.quantity
    });

    Product.updateOne(
      { _id: product._id, creator: req.userData.userId },
      productToUpdate
    )
      .then(result => {
        if (result.n > 0) {
          responseStatus = 200;
        } else {
          responseStatus = 401;
        }
      })
      .catch(error => {
        responseStatus = 500;
      });
  });
  switch (responseStatus) {
    case 401:
      res.status(401).json({ message: "Not authorized!" });
    case 500:
      res.status(500).json({
        message: "Couldn't udpate product!"
      });
    default:
      res.status(200).json({ message: "Update successful!" });
      break;
  }
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Product failed!"
      });
    });
};

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productsQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    fetchedProducts.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productsQuery
    .then(documents => {
      fetchedProducts = documents;
      return Product.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Products fetched successfully!",
        products: fetchedProducts,
        maxProducts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching products failed!"
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting products failed!"
      });
    });
};
