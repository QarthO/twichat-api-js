var axios = require('axios')

async function fetchChannelEmotes(twitchID) {
    let url = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${twitchID}`
    return new Promise ( (resolve, reject) => {
        axios.get(url)
            .then(res => {
                if(res.status != 200) return resolve()
                let obj = {}
                Object.assign(obj, ...res.data.map((x) => ({[x.code]: x.id})))
                resolve(obj)
            })
            .catch(err => {
                console.log(err)
                resolve()
            })
    })
}
module.exports.fetchChannelEmotes = fetchChannelEmotes