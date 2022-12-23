import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { getUsers, writeUsers } from "../../lib/fs-tools.js";

const usersRouter = express.Router();

const usersJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/users.json"
);

usersRouter.post("/", async (req, res) => {
  const newUser = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    // avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  const usersArray = await getUsers();
  usersArray.push(newUser);
  writeUsers(usersArray);
  res.status(201).send({
    id: newUser.id,
  });
});

usersRouter.post("/checkEmail", async (req, res) => {
  const emailToCheck = req.body.email;

  const usersArray = await getUsers();

  usersArray.find((user) => user.email === emailToCheck)
    ? res.status(201).send("email is already used")
    : res.status(201).send("email is not used");
});

usersRouter.get("/", async (req, res) => {
  const usersArray = await getUsers();
  console.log(usersArray);
  res.send(usersArray);
});

usersRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const usersArray = await getUsers();
  console.log("this is the users array", usersArray)
  const foundUser = usersArray.find((user) => user.id === userId);
  res.send(foundUser);
});

usersRouter.put("/:userId", async (req, res) => {
  const usersArray = await getUsers();
  const index = usersArray.findIndex((user) => user.id === req.params.userId);
  const oldUser = usersArray[index];
  const updatedUser = {
    ...oldUser,
    ...req.body,
    updatedAt: new Date(),
  };
  usersArray[index] = updatedUser;
  writeUsers(usersArray);

  res.send(updatedUser);
});

usersRouter.delete("/:userId", async (req, res) => {
  const usersArray = await JSON.parse(fs.readFileSync(usersJSONPath));
  const remainingUsers = usersArray.filter(
    (user) => user.id !== req.params.userId
  );
  writeUsers(remainingUsers);

  res.send();
});

export default usersRouter;