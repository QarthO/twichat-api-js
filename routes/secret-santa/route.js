var express = require('express');
var router = express.Router();

module.exports = router

// handles GET requests
router.get('/christmas', async (req, res) => {
    res.render('index')
  res.status(200).send(api_response)
})