import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const commentSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is mandatory field and needs to be a string!",
    },
  },
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    },
  },
};

export const checkCommentsSchema = checkSchema(commentSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during book validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};