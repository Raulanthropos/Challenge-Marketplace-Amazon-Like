export const badRequestHanlder = (err, req, res, next) => {
    if ((err.status = 400)) {
      res.status(400).send({ message: err.message });
    } else {
      next(err);
    }
  };
  
  export const unauthorizedHandler = (err, req, res, next) => {
    if ((err.status = 401)) {
      res.status(401).send({ message: err.message });
      console.log(err);
    } else {
      next(err);
    }
  };
  
  export const notFoundHandler = (err, req, res, next) => {
    if ((err.status = 404)) {
      res.status(404).send({ message: err.message });
    } else {
      next(err);
    }
  };
  export const genericErrorHandler = (err, req, res, next) => {
    console.log("Error recieved", err);
    res.status(500).send({ message: "Unexpected error" });
  };