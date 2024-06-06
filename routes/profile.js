const express = require("express");
const router = express.Router();
const {
    getVinylById,
    deleteVinyl
  } = require("../lib/methods");
  const {
    getAllAlbumInfo
  } = require("../lib/apiMethods");

router.get("/:id", async function (req, res) {
    const id = req.params.id;
    try {
      const vinyl = await getVinylById(id);
      if (!vinyl) {
        return res.status(404).send('Vinyl not found');
      }
      let album = vinyl[0].album_name;
      let artist = vinyl[0].artist_name;
      let url = vinyl[0].art_url;
      const songs = await getAllAlbumInfo(album, artist);
      
      const profileInfo = {
          album,
          artist,
          songs,
          url,
          id: vinyl[0].id
      }
      res.render("profile", { profileInfo, user: req.session.user });
    } catch (err) {
      next(err);
    }
});

router.post("/:id", async function (req, res) {
  const { type } = req.body;
  if (type === "remove") {
    await deleteVinyl(req.params.id);
    res.locals.cancel = `Album removed Successfully`;
    res.redirect("/dashboard");
  }
});

module.exports = router;
