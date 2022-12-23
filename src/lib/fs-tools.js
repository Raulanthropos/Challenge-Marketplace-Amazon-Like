import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/users");

const usersJSONPath = join(dataFolderPath, "users.json");
const blogsJSONPath = join(dataFolderPath, "blogs.json");

export const getUsers = () => readJSON(usersJSONPath);
export const writeUsers = (usersArray) => writeJSON(usersJSONPath, usersArray);
export const getBlogs = () => readJSON(blogsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(blogsJSONPath, blogsArray);

export const saveUsersAvatars = (filename, contentAsABuffer) =>
  writeFile(join(publicFolderPath, filename), contentAsABuffer);