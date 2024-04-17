require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { signupValidation } = require("./utils/validator");
const { validateErrors } = require("./utils/middleware");
const { matchedData } = require("express-validator");
const prisma = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/auth/signup", signupValidation, validateErrors, async (req, res) => {
  /**
   * @type {import("@prisma/client").User}
   */
  const { email, name, password } = matchedData(req);
  try {
    const user = await prisma.user.create({ data: { name, password, email } });
    if (user) {
      res.status(200).json({ id: user.id, msg: "User registered" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log("listening on http://0.0.0.0:" + PORT);
});
