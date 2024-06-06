const express = require("express");
const router = express.Router();
const { getSite } = require("../lib/methods");

router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    res.json({ error: "Not logged in" });
    return;
  }

  const { siteId } = req.query;

  if (!siteId) {
    res.json({ error: "Missing siteId. Usage: /site?siteId=4" });
    return;
  }

  const site = await getSite(siteId);
  res.json(site);
});

module.exports = router;
