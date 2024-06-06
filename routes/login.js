const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const url = require("url");

const { getUserByEmail } = require("../lib/methods");

router.get("/", function (req, res, next) {
  const message = url.parse(req.url, true).query.message;
  res.render("login", { message, user: req.session.user });
});

router.post("/", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.redirect("/login?message=Missing form data");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.redirect("/login?message=Invalid email");
  }

  const match = await bcrypt.compare(password, user.hashed_password);

  if (!match) {
    return res.redirect("/login?message=Invalid password");
  }

  req.session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  req.session.save((err) => {
    if (err) {
      next(err);
    } else {
      console.log("User session saved:", req.session.user); // Debug log
      if (user.name == "admin") {
        res.redirect("/admin");
      }
      res.redirect("/dashboard");
    }
  });
});

module.exports = router;
