require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const neo4j = require('neo4j-driver')

const uri = process.env.AURA_URI;
const user = process.env.AURA_USER;
const password = process.env.AURA_PASSWORD;


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

    } catch (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }

}



function doesTrackExist(session, spotifyID){
    return session.readTransaction(tx =>
        tx.run(
            'match (track:Track {spotifyID: $spotifyID}) return track',
            {spotifyID}
        ).then(res => res.records.length > 0 ? true : false)
    )
}

function createTrackAndMergeArtists(session, track){
    return session.writeTransaction(tx => 
        tx.run(`
            create (t:Track {spotifyID: $track.id})
            with t
            unwind $track.artists as artist
            MERGE (a:Artist {spotifyID:artist.id}) 
            ON CREATE SET 
                a.visited=false,
                a.name=artist.name
            MERGE (a)-[:Collaborated]->(t)`,
            {track}
        )
    )
}

function getUnvisitedArtists(session){
    return session.readTransaction(tx =>
        tx.run('match(artist:Artist {visited:false}) return artist')    
    ).then(res => res.records)
}

(async ()=>{
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

    await newToken()
    await driver.verifyConnectivity();
    const session = driver.session();

    const artistRecords = await getUnvisitedArtists(session)
    for (const record of artistRecords) {
        let artistNode = record.get('artist')
        let {spotifyID} = artistNode.properties
        console.log(spotifyID);
        // get albums for the artistID

        let offset = 0;
        const limit = 50
        let res = await spotifyApi.getArtistAlbums(spotifyID, {offset, limit})
        const albums = res.body.items;
        // console.log(res);
        while (res.body.next){
            offset+=limit;
            res = await spotifyApi.getArtistAlbums(spotifyID, {offset, limit})
            albums.push(...res.body.items);
        }
        console.log(albums);

        // über alben iterieren
        for (const album of albums) {
            // if album is compilation or if artist < 2 or if album already in database
            

        }
    }
    // console.log(artistNodes[0].get('artist').properties.spotifyID);



})()