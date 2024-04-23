const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const prisma = require("../db");
const passport = require("passport");

/**
 *
 * @param {passport.PassportStatic} passport
 * @returns void
 */
module.exports = function (passport) {
  /**
   * @type {import("passport-jwt").StrategyOptionsWithRequest}
   */
  let options = {
    secretOrKey: "__cap_jwt*secret",
    jwtFromRequest: cookieExtractor,
  };
  passport.use(
    "jwtt",
    new JwtStrategy(options, async function (
      // /** @type {import("express").Request} */ req,
      { email, password },
      done
    ) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          console.log(1);
          return done(null, false, {
            message: "That email is not registered",
          });
        } else if (user && user.password !== password) {
          console.log(2);
          return done(null, false, {
            message: "Password incorrect",
          });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred." });
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user);
  });
};

/**
 *
 * @param {import("express").Request} req
 * @returns
 */
function cookieExtractor(req) {
  /**
   * @type string
   */
  let token;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}
