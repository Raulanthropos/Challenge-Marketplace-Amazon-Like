import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checkCommentsSchema, triggerBadRequest } from "./validator.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const commentsRouter = express.Router();

const commentsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/comments.json"
);
const getComments = () => JSON.parse(fs.readFileSync(commentsJSONPath));
const postComments = (commentsArray) =>
  fs.writeFileSync(commentsJSONPath, JSON.stringify(commentsArray));

commentsRouter.post("/", checkCommentsSchema, triggerBadRequest, async (req, res, next) => {
  const commentsArray = await getComments();
  try {
    const newComment = {
      ...req.body,
      createdAt: new Date(),
      id: uniqid(),
    };
    commentsArray.push(newComment);
    postComments(commentsArray);
    res.status(201).send({
      id: newComment.id,
    });
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/", async (req, res, next) => {
  try {
    const commentsArray = await getComments();
    if (req.query && req.query.brand) {
      const filteredcomments = commentsArray.filter(
        (comment) => comment.brand === req.query.brand
      );
      res.send(filteredcomments);
    } else {
      res.send(commentsArray);
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:commentId", async (req, res, next) => {
  try {
    const commentsArray = await getComments();
    const comment = commentsArray.find((comment) => comment.id === req.params.commentId);
    if (comment) {
      res.send(comment);
    } else {
      next(NotFound(`comment with id ${req.params.commentId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:commentId", async (req, res, next) => {
  try {
    const commentsArray = await getComments();

    const index = commentsArray.findIndex((comment) => comment.id === req.params.commentId);
    const oldcomment = commentsArray[index];
    const updatedComment = {
      ...oldcomment,
      ...req.body,
      updatedAt: new Date(),
    };
    commentsArray[index] = updatedComment;
    postComments(commentsArray);
    res.send(updatedComment);
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const commentsArray = await getComments();
    const remainingComments = commentsArray.filter(
      (comment) => comment.id !== req.params.commentId
    );
    postComments(remainingComments);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;