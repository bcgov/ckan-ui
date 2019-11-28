let express = require('express');
let router = express.Router();

router = require('./datasets')(router);
router = require('./groups')(router);
router = require('./misc')(router);
router = require('./organizations')(router);
router = require('./resources')(router);
router = require('./scheming')(router);
router = require('./user')(router);

module.exports = router;