const router = require('express').Router();

router.get('/:artistID', (req, res) => {
    
    console.log('soooos');
    // find shortest path for artistID
    // check if path exists
    // if not return none
    res.send([2345,23452345,23452345,2345])
})

module.exports = router