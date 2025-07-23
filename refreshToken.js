const fetch = require("node-fetch");
require("dotenv").config();

const getRefreshToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = "https://vetrina-five.vercel.app/callback"; // must match what you used before
  const code = "AQBultratKUrk_2Mi2dlILlTCdf3DQUwg0_qSHDzzM1f_iKjKzizCiahlTEKlisrT97XTCtfPHUi07cY8E9zyGJf-kRs6artaq1Vl411iAcXLOrUG9t2RwqUqBfuJWm6hbIGbCW9sl0iOnVGwSTRP4IijOVXhghngQAPek6eJXK7V1YCg0dG0kC6RHi6nACm_72BxIo79I3FOEXFo1F58D4dKeACofIBMywmJucYZdwm3p_dFDNzTrF8-H3yOMLDpW-L";

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    console.log(data); // You'll see: access_token, refresh_token, etc.
  } catch (err) {
    console.error(err);
  }
};

getRefreshToken();
