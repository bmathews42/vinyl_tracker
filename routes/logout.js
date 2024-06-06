const express = require("express");
const router = express.Router();

router.get("/logout", function (req, res) {
  // Clear the user session
  req.session.destroy(function (err) {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      // Redirect to the login page or any other desired page
      res.redirect("/login");
    }
  });
});

module.exports = router;
