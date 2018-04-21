const _ = require('lodash')
const axios = require('axios')
const { Router } = require('express')
const router = Router()
const API = require('./constants')

let getKillfeed = (kills, users) => {
    return kills.map(kill => ({
        killer: _.find(users, { 'id': kill.playerID }),
        victim: _.find(users, { 'id': kill.victimID }),
        victimPos: kill.victimPos,
        weaponUsed: kill.weaponUsed
    }))
}

router.get('/:match_id', (req, res) => {
    let matchID = req.params.match_id

    axios.get(API.USER).then(userRes => {
        axios.get(API.MATCH + `/${matchID}/kills`).then((matchRes) => {
            return res.status(200).send(getKillfeed(matchRes.data, userRes.data))
        })
        .catch(err => {
            return res.status(500, 'Something is wrong with MATCH API ?')
        })
    })
    .catch(err => {
        return res.status(500, 'Something is wrong with USER API ?')
    })
})

module.exports = router