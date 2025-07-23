// test-token.js - create this file and run locally
const fetch = require('node-fetch');

require('dotenv').config();

const PORT = process.env.PORT || 3000;


// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const CLIENT_ID = SPOTIFY_CLIENT_ID;
const CLIENT_SECRET =  SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = SPOTIFY_REFRESH_TOKEN ;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

async function testToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (data.access_token) {
      console.log('✅ Token is valid!');
    } else {
      console.log('❌ Token is invalid!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testToken();