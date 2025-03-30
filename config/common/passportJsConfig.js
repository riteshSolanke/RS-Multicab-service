const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/commonModels/commonUserModel");
const bcrypt = require("bcrypt");

// local-strategy configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function verify(email, password, cb) {
      const user = await User.findOne({ email: email });

      if (!user) {
        return cb(null, false, { sms: `Incorrect Username or password` });
      }

      if (user.password == null) {
        return cb(null, false, { sms: `Incorrect Username or password` });
      }

      const correctPass = await bcrypt.compare(password, user.password);
      if (!correctPass)
        return cb(null, false, {
          sms: "Incorrect password! Enter correct password",
        });

      return cb(null, user);
    }
  )
);



//--------------------- Serializetion and Deserializetion of user------------------------

passport.serializeUser((user, done) => {
  console.log("Serializing user: ", { id: user.id, email: user.email });
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.error("User not found during deserialization.");
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err, null);
  }
});

module.exports = passport;
