// var axios = require('axios')

// async function fetchChannelEmotes(twitchID) {
//     let url = `https://7tv.io/v3/users/twitch/${twitchID}`
//     return new Promise ( (resolve, reject) => {
//         axios.get(url)
//             .then(res => {
//                 if(res.status != 200) return resolve()
//                 let obj = {}
//                 Object.assign(obj, ...res.data['emote_set']['emotes'].map((x) => ({[x.name]: x.id})))
//                 resolve(obj)
//             })
//             .catch(err => {
//                 console.log(err)
//                 resolve()
//             })
//     })
// }
// module.exports.fetchChannelEmotes = fetchChannelEmotes

// async function fetchGlobalEmotes() {
//     let url = `https://7tv.io/v3/emote-sets/62cdd34e72a832540de95857`
//     return new Promise ( (resolve, reject) => {
//         axios.get(url)
//             .then(res => {
//                 res.status == 200 ? resolve(Object.assign({}, ...res.data['emotes'].map((x) => ({[x.name]: x.id})))) : resolve()
//             })
//             .catch(err => {
//                 console.log(err)
//                 resolve()
//             })
//     })
// }

// module.exports.fetchGlobalEmotes = fetchGlobalEmotes