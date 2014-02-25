var handler = require('./lib/handler'),
    http    = require('http'),
    request = require('request');

init();

// boots the server
function boot(schema) {
  var server = http.createServer(handler(schema)),
      port   = process.env.PORT;

  server.listen(port, function() {
    console.log('mephisto lurks on port ' + port);
  });
}

// loads the schema and boots the server
function init() {
  loadSchema(function(err, res) {
    if (err) {
      throw err;
    }

    if (res.statusCode != 200) {
      throw 'mephisto did not receive 200 for schema request';
    }

    var schema = JSON.parse(res.body);
    boot(schema);
  });
}

// loads the schema
function loadSchema(cb) {
  var headers = { 'Accept': 'application/vnd.heroku+json; version=3' },
      url     = 'http://api.heroku.com/schema';

  request.get(url, { headers: headers }, cb);
}
