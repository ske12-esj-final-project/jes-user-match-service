const { Router } = require('express')
const Killfeed = require('./killfeed')

const router = Router()
router.use('/killfeed', Killfeed)

module.exports = router