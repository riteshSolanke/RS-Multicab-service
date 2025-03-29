const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
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

// ---------------------google-auth configuration---------------------------

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://passport-js-authentication.onrender.com/user/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "No email provided",
            name: profile.displayName,
            profilePicture:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : "No picture",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ---------------------github-auth configuration---------------------------

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://passport-js-authentication.onrender.com/user/auth/github/callback",
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "No email provided",
            name: profile.username,
            profilePicture:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : "No Picture",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
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
