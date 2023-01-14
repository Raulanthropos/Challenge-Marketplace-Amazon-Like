import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";
import httpErrors from "http-errors";
import { checksProductSchema, triggerBadRequest } from "./validator.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;
const productsRouter = express.Router();

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/products.json"
);

productsRouter.post("/", checksProductSchema, triggerBadRequest, async (req, res, next) => {
  try {
    const newproduct = {
      ...req.body,
      createdAt: new Date(),
      id: uniqid(),
      updatedAt: new Date().getMilliseconds()
    };
  const productsArray = await getProducts();
  productsArray.push(newproduct);
  await writeProducts(productsArray);

  res.status(201).send({
    id: newproduct.id,
  });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    console.log(productsArray);
    if (req.query && req.query.category) {
      const categoryProducts = productsArray.filter(
        (product) => product.category === req.query.category
      );
      res.send(categoryProducts);
    } else {
      res.send(productsArray);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const product = productsArray.find(product => product.id === req.params.productId)
    console.log("this is the product", product)
    const foundProduct = productsArray.find((product) => product.id === productId);
    if (product) {
      res.send(foundProduct);
    } else {
      next(NotFound(`Product with product id ${req.params.productId} was not found!`))
    }
  } catch (error) {
   next(error); 
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const index = productsArray.findIndex((product) => product.id === req.params.productId);
    if (index !==-1) {
      const oldProduct = productsArray[index];
      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };
      productsArray[index] = updatedProduct;
      await writeProducts(productsArray);
      res.send(updatedProduct);
    } else {
      next(NotFound(`You cannot edit this id ${req.params.productId}, because it doesn't correspond to a product in our database!`))
    }
  } catch (error) {
    next(error)
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productsArray = await JSON.parse(fs.readFileSync(productsJSONPath));
    const remainingProducts = productsArray.filter(
      (product) => product.id !== req.params.productId
    );
    if (productsArray.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);
      res.status(204).send();
    } else {
      next(NotFound(`Product with id ${req.params.productId} was not found, and therefore cannot be deleted!`))
    }
  } catch (error) {
    next(error)
  }
});

export default productsRouter;