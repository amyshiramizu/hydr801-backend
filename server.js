const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GHL_API = 'https://rest.gohighlevel.com/v1';
const GHL_TOKEN = 'pit-09f20811-7b00-4c3f-9fc3-d8cb1b838b5e';
const GHL_LOCATION = 'hFAagQwWGZ8zHNUCtv0c';

app.get('/', function(req, res) {
  res.json({ status: 'Hydr801 Backend Running', time: new Date().toISOString() });
});

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/ghl/contacts', function(req, res) {
  fetch(GHL_API + '/contacts?limit=20&locationId=' + GHL_LOCATION, {
    headers: { 'Authorization': 'Bearer ' + GHL_TOKEN }
  })
  .then(function(r) { return r.json(); })
  .then(function(data) { res.json(data); })
  .catch(function(e) { res.status(500).json({ error: e.message }); });
});

app.post('/api/ghl/contacts', function(req, res) {
  var body = req.body;
  body.locationId = GHL_LOCATION;
  fetch(GHL_API + '/contacts', {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + GHL_TOKEN, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(body)
  })
  .then(function(r) { return r.json(); })
  .then(function(data) { res.json(data); })
  .catch(function(e) { res.status(500).json({ error: e.message }); });
});

app.post('/api/ghl/contacts/:id/notes', function(req, res) {
  fetch(GHL_API + '/contacts/' + req.params.id + '/notes', {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + GHL_TOKEN, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(req.body)
  })
  .then(function(r) { return r.json(); })
  .then(function(data) { res.json(data); })
  .catch(function(e) { res.status(500).json({ error: e.message }); });
});

app.post('/api/ghl/contacts/:id/tags', function(req, res) {
  fetch(GHL_API + '/contacts/' + req.params.id + '/tags', {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + GHL_TOKEN, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(req.body)
  })
  .then(function(r) { return r.json(); })
  .then(function(data) { res.json(data); })
  .catch(function(e) { res.status(500).json({ error: e.message }); });
});

var PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});
