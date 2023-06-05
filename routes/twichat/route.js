require('dotenv').config();
var express = require('express');
var router = express.Router();
const https = require('https')
var api_twitch = require('./api/twitch.js')
var api_bttv = require('./api/bttv.js')
var api_ffz = require('./api/ffz.js')
var api_7tv = require('./api/7tv.js')

var app = express()
const port = 80

module.exports = router;

app.use(express.json())

// handles GET requests
app.get('/twitch/user/:username', async (req, res) => {

  var data = await main(req.params.username)

  if(data[0] == false){
    res.status(400).send(`Error: User ${req.params.username} doens't exist`)
    return
  }

  twitchID = data[2]

  var _badges = {
    global: await api_twitch.fetchGlobalBadges(),
    channel: await api_twitch.fetchChannelBadges(twitchID)
  }
  
  var _emotes = {
    bttv: {
      global: await api_bttv.fetchGlobalEmotes(),
      channel: await api_bttv.fetchChannelEmotes(twitchID)
    },
    ffz: {
      channel: await api_ffz.fetchChannelEmotes(twitchID)
    },
    seventv: {
      global: await api_7tv.fetchGlobalEmotes(),
      channel: await api_7tv.fetchChannelEmotes(twitchID)
    },
  }

  

  api_response = {
    username: data[4],
    displayname: data[1],
    id: data[2],
    pfp: data[3],
    emotes: _emotes,
    badges: _badges
}
  console.log(`Sending Response: '${req.url}'`)
  console.dir(api_response)

  res.status(200).send(api_response)
})

var oldDateObj = new Date()
var expire_date = new Date(oldDateObj.getTime() - 30*60000);

async function checkToken(){

  let today = new Date()

  if(today > expire_date){
    
    // fetch new token
    await fetchNewToken().then(function(res) {

      // token request fails
      error = res[0]
      if(error){
        return false
      }

      // res = [status, token, exp in ms from now]      
      // creates expiration date
      expire_date = new Date(oldDateObj.getTime() + res[2]); 
    }) 
  }
  return true 
}

var twitch_client_id = process.env.TWITCH_CLIENT_ID
var twitch_client_secret = process.env.TWITCH_CLIENT_SECRET
var oauth_token = null
var exp_date = null

// POST request options for api token
const fetch_api_options = {
  host: 'id.twitch.tv',
  port: 443,
  path: `/oauth2/token?client_id=${twitch_client_id}&client_secret=${twitch_client_secret}&grant_type=client_credentials`,
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0,
  }
}

function fetchNewToken(){
  return new Promise(function(resolve, reject){
    // runs the request fetch_api_options
    const req = https.request(fetch_api_options, res => {
      // console.log(`statusCode: ${res.statusCode}`)
      // when we get data back store the bearer token
      res.on('data', d => {
        response_data = JSON.parse(d)
        oauth_token = response_data['access_token']
        exp_date = response_data['expires_in']
        // console.log(`exp_date: ${exp_date}`)
        resolve([true, oauth_token, exp_date])
      })
    })
    
    req.on('error', error => {
      console.error(error)
      reject([false])
    })

    req.end()
  })
}

async function getTwitchUserInfo(username){

  // GET request twitch user info
  const fetch_twitch_user_options = {
    host: 'api.twitch.tv',
    port: 443,
    path: `/helix/users?login=${username}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${oauth_token}`,
      'Content-Type': 'application/json',
      'client-id': `${twitch_client_id}`
    }
  }

  return new Promise(function(resolve, reject){
    // runs the request fetch_api_options
    const req = https.request(fetch_twitch_user_options, res => {
      // console.log(`statusCode: ${res.statusCode}`)
      // when we get data back store the bearer token
      res.on('data', d => {
        response_data = JSON.parse(d)
        response_data = response_data['data'][0]

        if(response_data) {
          var id = response_data['id']
          var username = response_data['login']
          var display_name = response_data['display_name']
          var pfp_url = response_data['profile_image_url']
          resolve([true, display_name, id, pfp_url, username])

        } else {
          resolve([false])
        } 
        
      })
    })
    
    req.on('error', error => {
      console.error(error)
      reject([false])
    })

    req.end()
  })
}

async function main(username){
  await checkToken()
  var response = await getTwitchUserInfo(username)
  return response
}

const http = require('http')
httpServer = http.createServer({}, app);
httpServer.listen(port, () => {
  console.log('listening')
})