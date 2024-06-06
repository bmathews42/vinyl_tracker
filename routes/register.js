const express = require("express");
const router = express.Router();
const url = require("url");

const { createUser, getUserByEmail } = require("../lib/methods");

router.get("/", function (req, res, next) {
  const message = url.parse(req.url, true).query.message;
  res.render("register", { message, user: req.session.user });
});

router.post("/", async function (req, res, next) {
  const fullName = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password1;

  const foundUser = await getUserByEmail(email);
  if (foundUser) {
    return res.redirect("/register?message=Email already exists");
  }

  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await createUser(fullName, email, phone, hashedPassword);
  const newUser = await getUserByEmail(email);

  if (newUser) {
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    req.session.save((err) => {
      if (err) {
        next(err);
      } else {
        res.redirect("/dashboard");
      }
    });
  } else {
    res.redirect("/register?message=Error creating user");
  }
});

module.exports = router;
