var axios = require('axios')

async function fetchGlobalBadges() {
    var url = `https://badges.twitch.tv/v1/badges/global/display`
    return new Promise ( (resolve, reject) => {
        axios.get(url)
            .then(res => {
                res.status == 200 ? resolve(res.data['badge_sets']) : resolve()
            })
            .catch(err => {
                console.log(err)
                resolve()
            })
    })
}

async function fetchChannelBadges(twitchID) {
    let url = `https://badges.twitch.tv/v1/badges/channels/${twitchID}/display?language=en`
    return new Promise ( (resolve, reject) => {
        axios.get(url)
            .then(res => {
                res.status == 200 ? resolve(res.data['badge_sets']) : resolve()
            })
            .catch(err => {
                console.log(err)
                resolve()
            })
    })
}

module.exports = {
    fetchGlobalBadges, fetchChannelBadges
}