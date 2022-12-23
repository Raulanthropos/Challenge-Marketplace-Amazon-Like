import express from "express";
import listEndpoints from "express-list-endpoints";
import commentsRouter from "./api/comments/index.js";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";
import { join } from "path";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHanlder,
  unauthorizedHandler,
} from "./errorHandlers.js";
import cors from "cors";

const publicFolderPath = join(process.cwd(), "./public");

const server = express();

const port = 3001;
server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/comments", commentsRouter);
server.use("/files", filesRouter);

server.use(badRequestHanlder);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});