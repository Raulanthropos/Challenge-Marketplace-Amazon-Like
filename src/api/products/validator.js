import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest } = createHttpError;

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field and needs to be a string!",
    }
},
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and needs to be a string!",
    }
},
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    }
    },
  price: {
    in: ["body"],
    isString: {
      errorMessage: "Price is a mandatory field and needs to be a number!",
    },
  },
}

export const checksProductSchema = checkSchema(productSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    next(
      BadRequest(400, "Errors during product validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};