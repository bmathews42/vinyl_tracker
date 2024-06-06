require("dotenv").config();
key = process.env.LASTFM_API;
const {
    createVinyl
  } = require("../lib/methods");



// Function to fetch album info
async function getAlbumInfo(user, artist, album) {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=${artist}&album=${album}&format=json`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

         // Check for error in the response
         if (data.error) {
            throw new Error(`API Error: ${data.message}`);
            return 1;
        }

        //call method to upload to sql
        const largeImage = data.album.image.find(image => image.size === "extralarge")["#text"];
        await createVinyl(user, album, artist, largeImage);
    } catch (error) {
        console.error('Error fetching album info:', error);
        return 2;
    }
}

async function getAllAlbumInfo(album, artist) {
    try {
        console.log(artist);
        console.log(album);
        const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=${artist}&album=${album}&format=json`
        const response = await fetch(url);
        if (!response.ok) {
            console.error("first error");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check for error in the response
        if (data.error) {
            console.error("second error");
            throw new Error(`API Error: ${data.message}`);
        }

        let songs = [];

        if (Array.isArray(data.album.tracks.track)) {
            songs = data.album.tracks.track.map(track => track.name);
        } else if (data.album.tracks.track) {
            songs.push(data.album.tracks.track.name);
        }

        return { songs };
    } catch (error) {
        console.error('Error fetching album info:', error);
        return 2;
    }
}



module.exports = {
    getAlbumInfo,
     getAllAlbumInfo
  };