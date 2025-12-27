var express = require('express');
var cors = require('cors');
var https = require('https');

var app = express();
app.use(cors());
app.use(express.json());

var PODIUM_CLIENT_ID = '019b5df8-47bb-7827-9818-6840e3e4d62e';
var PODIUM_CLIENT_SECRET = '4bc33d52a96b5d76357a454278a31174162e665ea4b241eb01e4a9dd04900746';
var PODIUM_LOCATION = '0198f69e-803a-7474-84e0-fe397c2888b7';
var accessToken = null;

function getAccessToken(callback) {
  if (accessToken) return callback(null, accessToken);
  
  var auth = Buffer.from(PODIUM_CLIENT_ID + ':' + PODIUM_CLIENT_SECRET).toString('base64');
  var postData = 'grant_type=client_credentials';
  
  var options = {
    hostname: 'api.podium.com',
    path: '/oauth/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };
  
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      try {
        var parsed = JSON.parse(data);
        if (parsed.access_token) {
          accessToken = parsed.access_token;
          callback(null, accessToken);
        } else {
          callback(new Error('No access token: ' + data));
        }
      } catch(e) {
        callback(new Error('Parse error: ' + data));
      }
    });
  });
  req.on('error', callback);
  req.write(postData);
  req.end();
}

function podiumRequest(path, method, body, callback) {
  getAccessToken(function(err, token) {
    if (err) return callback(err);
    
    var postData = body ? JSON.stringify(body) : '';
    var options = {
      hostname: 'api.podium.com',
      path: path,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(postData);
    
    var req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try { callback(null, JSON.parse(data)); }
        catch(e) { callback(null, { raw: data }); }
      });
    });
    req.on('error', callback);
    if (body) req.write(postData);
    req.end();
  });
}

app.get('/', function(req, res) {
  res.send('OK');
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', service: 'Podium' });
});

app.get('/api/podium/contacts', function(req, res) {
  podiumRequest('/v4/locations/' + PODIUM_LOCATION + '/contacts', 'GET', null, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/podium/contacts', function(req, res) {
  var contact = {
    locationUid: PODIUM_LOCATION,
    name: req.body.firstName + ' ' + req.body.lastName,
    phoneNumber: req.body.phone,
    email: req.body.email
  };
  podiumRequest('/v4/contacts', 'POST', contact, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/podium/message', function(req, res) {
  var message = {
    locationUid: PODIUM_LOCATION,
    contactUid: req.body.contactUid,
    message: req.body.message
  };
  podiumRequest('/v4/messages', 'POST', message, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

var PORT = process.env.PORT || 8080;
var server = app.listen(PORT, '0.0.0.0', function() {
  console.log('Server running on port ' + PORT);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
