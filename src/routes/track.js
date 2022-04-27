const { session } = require('../services/neo4j');

const router = require('express').Router()



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
            MERGE (a)-[:Collaborated]->(t)`,
            {track}
        )
    )
}

// post 
// track
// artists

router.post('/', async (req, res)=>{
    const session = req.driver.session();
    const track = req.body

    try{
        let trackExists = await doesTrackExist(session, track.id)

        if (! trackExists) {
            let res = await createTrackAndMergeArtists(session, track)
        }

    }finally{
        session.close();
    }


    res.send('soos')
})

module.exports = router;