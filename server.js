const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GHL = 'https://rest.gohighlevel.com/v1';
const TOKEN = 'pit-09f20811-7b00-4c3f-9fc3-d8cb1b838b5e';
const LOC = 'hFAagQwWGZ8zHNUCtv0c';

app.get('/', (req, res) => {
  res.json({ status: 'Hydr801 Backend Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/ghl/contacts', async (req, res) => {
  try {
    const r = await fetch(GHL + '/contacts?limit=20&locationId=' + LOC, {
      headers: { 'Authorization': 'Bearer ' + TOKEN }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ghl/contacts', async (req, res) => {
  try {
    const body = { ...req.body, locationId: LOC };
    const r = await fetch(GHL + '/contacts', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + TOKEN, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ghl/contacts/:id/notes', async (req, res) => {
  try {
    const r = await fetch(GHL + '/contacts/' + req.params.id + '/notes', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + TOKEN, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ghl/contacts/:id/tags', async (req, res) => {
  try {
    const r = await fetch(GHL + '/contacts/' + req.params.id + '/tags', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer ' + TOKEN, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
