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
  console.log("🔵 SERIALIZING USER:", user._id);
  done(null, user._id); // Ensure only user ID is stored
});


passport.deserializeUser(async (id, done) => {
  console.log("🔄 Deserializing user ID:", id); // Debugging log
  
  if (!id) {
    console.error("❌ No user ID found in session!");
    return done(null, false);
  }

  try {
    const user = await User.findById(id);
    
    if (!user) {
      console.error("❌ User not found during deserialization.");
      return done(null, false);
    }

    console.log("✅ User deserialized successfully:", user.email);
    done(null, user);
  } catch (err) {
    console.error("❌ Error during deserialization:", err);
    done(err, null);
  }
});



module.exports = passport;
