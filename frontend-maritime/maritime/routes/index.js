var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shipment Prep' });
});

router.get('/socket.io.js', (req, res, next) => {
  return res.sendFile('C:/Users/siyangqiu/OneDrive/Git Projects/SocketApp/SocketApp/maritime/node_modules/socket.io-client/dist/socket.io.js');
});

router.get('/socket.io-file-client.js', (req, res, next) => {
  return res.sendFile('C:/Users/siyangqiu/OneDrive/Git Projects/SocketApp/SocketApp/maritime/node_modules/socket.io-file-client/socket.io-file-client.js');
});

module.exports = router;
