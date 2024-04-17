const { oneOf, body } = require("express-validator");
const prisma = require("../db");
const signupValidation = oneOf([
  [
    body("email")
      .notEmpty()
      .withMessage("The email field should not be empty")
      .custom(async (email = "") => {
        console.log(email);
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (user) {
          throw new Error("There is an account with this email");
        }
        return true;
      }),
    body("name")
      // .withMessage("Where is the name??")
      .notEmpty()
      .withMessage("The name field should not be empty"),
    body("password")
      .notEmpty()
      .withMessage("The password field should not be empty"),
  ],
]);

module.exports = { signupValidation };
