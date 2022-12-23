import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validator.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogsRouter = express.Router();

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/blogs.json"
);
const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const postBlogs = (blogsArray) =>
  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

blogsRouter.post("/", checkBlogsSchema, triggerBadRequest, (req, res, next) => {
  const blogsArray = getBlogs();
  try {
    const newBlog = {
      ...req.body,
      createdAt: new Date(),
      id: uniqid(),
    };

    blogsArray.push(newBlog);
    postBlogs(blogsArray);
    res.status(201).send({
      id: newBlog.id,
    });
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    if (req.query && req.query.category) {
      const filteredBlogs = blogsArray.filter(
        (blog) => blog.category === req.query.category
      );
      res.send(filteredBlogs);
    } else {
      res.send(blogsArray);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const index = blogsArray.findIndex((blog) => blog.id === req.params.blogId);
    const oldBlog = blogsArray[index];
    const updatedBlog = {
      ...oldBlog,
      ...req.body,
      updatedAt: new Date(),
    };
    blogsArray[index] = updatedBlog;
    postBlogs(blogsArray);
    res.send(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const remainingBlogs = blogsArray.filter(
      (blog) => blog.id !== req.params.blogId
    );
    postBlogs(remainingBlogs);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;