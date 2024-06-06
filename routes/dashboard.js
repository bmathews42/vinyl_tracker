const express = require("express");
const router = express.Router();
const {
  getUserVinyls
} = require("../lib/methods");
const {
  getAlbumInfo
} = require("../lib/apiMethods");

const defaultRenderProps = {
  user: null,
  message: null,
  success: null,
  failed: null,
  exists: null,
  remove: null,
  edit: null,
  savedPayment: [],
  reservations: [],
  existingReservations: [],
};

// Middleware to ensure default properties are always set
router.use((req, res, next) => {
  res.locals = { ...defaultRenderProps, user: req.session.user };
  next();
});

router.get("/", async function (req, res) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  let vinyls = await getUserVinyls(req.session.user.id);
  res.render("dashboard", { user: req.session.user, vinyls });
});

router.post("/", async function (req, res) {
  const { type } = req.body;

  // If the user adds an album
  if (type === "add") {
    // Get values from form
    const { albumName, artistName } = req.body;
    
    try {
      let result = await getAlbumInfo(req.session.user.id, artistName, albumName);
      if (result === 1) {
        res.locals.failed = `Error: Album not found`;
      } else if (result === 2) {
        res.locals.failed = `Error: Could not enter into Database`;
      } else {
        res.locals.success = `${albumName} added Successfully`;
      }
    } catch (error) {
      console.error("Error adding album:", error);
      res.locals.failed = `Error: ${error.message}`;
    }
  }

  let vinyls = await getUserVinyls(req.session.user.id);
  res.render("dashboard", { user: req.session.user, vinyls });
});


module.exports = router;
