var express = require("express");
var router = express.Router();
const { findAllReservations } = require("../lib/methods");

router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const reservations = await findAllReservations();
  const currentDate = new Date();
  const pastReservations = reservations.filter(
    (reservation) => new Date(reservation.end_date) < currentDate
  );
  const upcomingReservations = reservations.filter(
    (reservation) => new Date(reservation.end_date) >= currentDate
  );

  res.render("admin", {
    pastReservations,
    upcomingReservations,
  });
});

module.exports = router;
