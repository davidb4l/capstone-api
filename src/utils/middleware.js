const { validationResult } = require("express-validator");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const validateErrors = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.json({ errors: errors.array() });
    // console.log(errors.array())
    return res
      .status(400)
      .json(errors.array()[0].nestedErrors[0].map((v, i) => v.msg));
  }
  return next();
};

module.exports = { validateErrors };
