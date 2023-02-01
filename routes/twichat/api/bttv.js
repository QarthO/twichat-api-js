var axios = require('axios')

async function fetchChannelEmotes(twitchID) {
    let url = `https://api.betterttv.net/3/cached/users/twitch/${twitchID}`
    return new Promise ( (resolve, reject) => {
        axios.get(url)
            .then(res => {
                if(res.status != 200) return resolve()
                let obj = {}
                Object.assign(obj, ...res.data['channelEmotes'].map((x) => ({[x.code]: x.id})))
                Object.assign(obj, ...res.data['sharedEmotes'].map((x) => ({[x.code]: x.id})))
                resolve(obj)
            })
            .catch(err => {
                console.log(err)
                resolve()
            })
    })
}
module.exports.fetchChannelEmotes = fetchChannelEmotes

async function fetchGlobalEmotes() {
    let url = `https://api.betterttv.net/3/cached/emotes/global`
    return new Promise ( (resolve, reject) => {
        axios.get(url)
            .then(res => {
                res.status == 200 ? resolve(Object.assign({}, ...res.data.map((x) => ({[x.code]: x.id})))) : resolve()
            })
            .catch(err => {
                console.log(err)
                resolve()
            })
    })
}

module.exports.fetchGlobalEmotes = fetchGlobalEmotes