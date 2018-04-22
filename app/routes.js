const { Router } = require('express')
const Killfeed = require('./killfeed')
const Profile = require('./profile')

const router = Router()
router.use('/killfeed', Killfeed)
router.use('/profile', Profile)

module.exports = router