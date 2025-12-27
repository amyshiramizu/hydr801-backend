var express = require('express');
var cors = require('cors');
var https = require('https');

var app = express();
app.use(cors());
app.use(express.json());

var GHL_TOKEN = 'pit-1f5872ee-67b9-4397-b949-043d389e63bc';
var GHL_LOCATION = 'hFAagQwWGZ8zHNUCtv0c';

function ghlRequest(path, method, body, callback) {
  var options = {
    hostname: 'rest.gohighlevel.com',
    path: '/v1' + path,
    method: method,
    headers: {
      'Authorization': 'Bearer ' + GHL_TOKEN,
      'Content-Type': 'application/json'
    }
  };
  
  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      try { callback(null, JSON.parse(data)); }
      catch(e) { callback(null, { raw: data }); }
    });
  });
  
  req.on('error', function(e) { callback(e); });
  if (body) req.write(JSON.stringify(body));
  req.end();
}

app.get('/', function(req, res) {
  res.send('OK');
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok' });
});

app.get('/api/ghl/contacts', function(req, res) {
  ghlRequest('/contacts?limit=20&locationId=' + GHL_LOCATION, 'GET', null, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/ghl/contacts', function(req, res) {
  var body = req.body;
  body.locationId = GHL_LOCATION;
  ghlRequest('/contacts', 'POST', body, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/ghl/contacts/:id/notes', function(req, res) {
  ghlRequest('/contacts/' + req.params.id + '/notes', 'POST', req.body, function(err, data) {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/api/ghl/contacts/:id/tags', function(req, res) {
  ghlRequest('/contacts/' + req.params.id + '/tags', 'POST', req.body, function(err, data) {
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
