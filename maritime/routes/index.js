var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Shipment Prep" });
});

router.get("/socket.io.js", (req, res, next) => {
  return res.sendFile(
    "/Users/reibs/Documents/doc-it/maritime/node_modules/socket.io-client/dist/socket.io.js"
  );
});

router.get("/socket.io-file-client.js", (req, res, next) => {
  return res.sendFile(
    "/Users/reibs/Documents/doc-it/maritime/node_modules/socket.io-file-client/socket.io-file-client.js"
  );
});

router.get("/bol.jpg", (req, res, next) => {
  return res.sendFile("/Users/reibs/Documents/doc-it/documents/bol.jpg");
});

module.exports = router;
