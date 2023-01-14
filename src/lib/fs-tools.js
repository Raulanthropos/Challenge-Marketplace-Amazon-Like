import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/products");

console.log(dataFolderPath, publicFolderPath, process.cwd());

const productsJSONPath = join(dataFolderPath, "products.json");
const commentsJSONPath = join(dataFolderPath, "comments.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) => writeJSON(productsJSONPath, productsArray);
export const getcomments = () => readJSON(commentsJSONPath);
export const writecomments = (commentsArray) => writeJSON(commentsJSONPath, commentsArray);

export const saveProductsAvatars = (filename, contentAsABuffer) =>
  writeFile(join(publicFolderPath, filename), contentAsABuffer);

  