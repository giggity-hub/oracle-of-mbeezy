const router = require('express').Router();

router.use('/track', require('./track'));
router.use('/shortest-path', require('./shortest-path'))

module.exports = router;