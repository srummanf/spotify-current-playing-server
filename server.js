require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} = process.env;

const getAccessToken = async () => {
  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || "Failed to refresh token");

  return data.access_token;
};

app.get("/np", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!data || !data.item) {
      return res.json({ playing: false, message: "Nothing is playing" });
    }

    const track = data.item;
    const cleaned = {
      playing: data.is_playing,
      song_name: track.name,
      artists: track.artists.map((artist) => artist.name).join(", "),
      album_image: track.album?.images?.[0]?.url || null,
      progress_ms: data.progress_ms,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls?.spotify,
      device_name: data.device?.name,
      device_type: data.device?.type,
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/np`);
});
