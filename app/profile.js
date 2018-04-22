const _ = require('lodash')
const axios = require('axios')
const { Router } = require('express')
const router = Router()
const API = require('./constants')

let getRecentMatches = (userID, matches) => {
    return _.filter(matches, match => {
        return _.includes(match.players, userID)
    })
}

let getNumberWins = (userID, matches) => {
    return _.size(_.filter(matches, match => {
        return match.winner === userID
    }))
}

let getKills = (userID, kills) => {
    let ownKills = _.filter(kills, kill => {
        return kill.playerID === userID && kill.victimID !== userID
    })

    let weapons = _.countBy(ownKills, 'weaponUsed')
    return _.map(Object.keys(weapons), weapon => {
        return {
            name: weapon,
            kills: weapons[weapon]
        }
    })
}

router.get('/:user_id', (req, res) => {
    let userID = req.params.user_id

    axios.get(API.USER + `/u/${userID}`).then(userRes => {
        axios.get(API.MATCH).then(matchRes => {
            axios.get(API.KILL).then(killRes => {
                let user = userRes.data
                let matches = matchRes.data
                let kills = killRes.data
                let recentMatches = getRecentMatches(userID, matches)

                let result = {
                    username: user.username,
                    score: user.score,
                    clothIndex: user.clothIndex,
                    recentMatches: recentMatches,
                    kills: getKills(userID, kills),
                    numWins: getNumberWins(userID, recentMatches),
                }

                return res.status(200).send(result)

            })
                .catch(err => {
                    return res.status(500, 'Something is wrong with KILL API ?')
                })
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
