require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})


async function newToken(){
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const {expires_in, access_token} = data.body;
        // request new Token after expiration
        setTimeout(newToken, expires_in*1000)
        spotifyApi.setAccessToken(access_token);
        console.log(expires_in, access_token);

    } catch (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }

}

// Create new Token on App start
newToken().then(()=>{
    // console.log("soosenbinder");
    // Get Elvis' albums
    setInterval(()=>{
        spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
            function(data) {
            console.log('Artist albums', data.body);
            },
            function(err) {
            console.error(err);
            }
        );
    },2000)
})

module.exports = spotifyApi



