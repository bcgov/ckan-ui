let express = require('express');
let router = express.Router();
let config = require('config')

router.get('/powConfig', function (req, res, next){ 
    return res.json({"pow": config.get('pow')})
})

router.get('/ofiConfig', function(req, res, next) {
    return res.json({"ofi": config.get('ofi')})
})

module.exports = router;

