require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { signupValidation, loginValidation } = require("./utils/validator");
const { validateErrors } = require("./utils/middleware");
const { matchedData } = require("express-validator");
const prisma = require("./db");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const passportJwt = require("./utils/passport");

const app = express();

passportJwt(passport);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("__cookie_sec_ter12**"));

app.use(passport.initialize());

app.post("/auth/signup", signupValidation, validateErrors, async (req, res) => {
  /**
   * @type {import("@prisma/client").User}
   */
  const { email, name, password } = matchedData(req);
  try {
    const user = await prisma.user.create({ data: { name, password, email } });
    if (user) {
      res.status(201).json({ id: user.id, msg: "User registered" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

app.post(
  "/auth/login",
  loginValidation,
  validateErrors,
  passport.authenticate("jwtt", { session: false }),
  function (req, res, next) {
    console.log(3);
    res.status(200).json(req.user);
  }
);

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log("listening on http://0.0.0.0:" + PORT);
});
module.exports = app;
