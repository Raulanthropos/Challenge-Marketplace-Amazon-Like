import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";

const productsRouter = express.Router();

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json"
);

productsRouter.post("/", async (req, res) => {
  const newproduct = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    updatedAt: new Date().getMilliseconds()
  };

  const productsArray = await getProducts();
  productsArray.push(newproduct);
  writeProducts(productsArray);
  res.status(201).send({
    id: newproduct.id,
  });
});

productsRouter.get("/", async (req, res) => {
  const productsArray = await getProducts();
  console.log(productsArray);
  res.send(productsArray);
});

productsRouter.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const productsArray = await getProducts();
  console.log("this is the products array", productsArray)
  const foundProduct = productsArray.find((product) => product.id === productId);
  res.send(foundProduct);
});

productsRouter.put("/:productId", async (req, res) => {
  const productsArray = await getProducts();
  const index = productsArray.findIndex((product) => product.id === req.params.productId);
  const oldProduct = productsArray[index];
  const updatedProduct = {
    ...oldProduct,
    ...req.body,
    updatedAt: new Date(),
  };
  productsArray[index] = updatedProduct;
  writeProducts(productsArray);

  res.send(updatedProduct);
});

productsRouter.delete("/:productId", async (req, res) => {
  const productsArray = await JSON.parse(fs.readFileSync(productsJSONPath));
  const remainingProducts = productsArray.filter(
    (product) => product.id !== req.params.productId
  );
  writeProducts(remainingProducts);

  res.send();
});

export default productsRouter;