import express from "express";
import multer from "multer";
import { extname } from "path";
import { saveProductsAvatars, getProducts, writeProducts } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:productId/single",
  multer().single("imageUrl"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalName);
      const fileName = req.params.productId + originalFileExtension;

      await saveProductsAvatars(fileName, req.file.buffer);
      const url = `http://localhost:3001/img/products/${fileName}`;
      const products = await getProducts();
      const index = products.findIndex((product) => product.id === req.params.productId);
      if (index !== -1) {
        const oldProduct = products[index];
        const updatedproduct = { ...oldProduct, updateAt: new Date() };
        products[index] = updatedproduct;
        await writeProducts(products);
      }
      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.put(
  "/:productId/single",
  multer().single("image"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalName);
      const fileName = req.params.productId + originalFileExtension;

      await saveProductsAvatars(fileName, req.file.buffer);
      const url = `http://localhost:3001/products/${fileName}`;
      const products = await getProducts();
      const index = products.findIndex((product) => product.id === req.params.productId);
      if (index !== -1) {
        const oldProduct = products[index];
        const updatedProduct = { ...oldProduct, updateAt: new Date() };
        products[index] = updatedProduct;
        await writeProducts(products);
      }
      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;