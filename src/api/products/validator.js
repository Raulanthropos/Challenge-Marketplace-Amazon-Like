import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is mandatory field and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    }
},
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    }
},
  _id: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    }
    },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    }
    },
  price: {
    in: ["body"],
    isString: {
      errorMessage: "Id is mandatory field and needs to be a string!",
    },
  },
}

export const checkproductsSchema = checkSchema(productSchema);
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