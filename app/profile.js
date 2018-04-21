const _ = require('lodash')
const axios = require('axios')
const { Router } = require('express')
const router = Router()
const API = require('./constants')

let getJoinedMatches = (userID, matches) => {
    return matches.map(match => {
        return _.includes(match.players, userID)
    })
}

let getNumberWins = (userID, matches) => {
    return _.size(matches.map(match => {
        return match.winner === userID
    }))
}

let getNumberKills = (userID, kills) => {
    return _.size(kills.map(kill => {
        return kill.playerID === userID && kill.victimID !== userID
    }))
}

router.get('/:user_id', (req, res) => {
    let userID = req.params.user_id
    
    axios.get(API.USER + `/${userID}`).then(userRes => {
        axios.get(API.MATCH).then(matchRes => {
            axios.get(API.KILL).then(killRes => {
                let user = userRes.data
                let matches = matchRes.data
                let kills = killRes.data

                let result = {
                username: user.username,
                score: user.score,
                clothIndex: user.clothIndex,
                joinedMatches: getJoinedMatches(userID, matches),
                numWins: getNumberWins(userID, matches),
                numKills: getNumberKills(userID, kills)
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
