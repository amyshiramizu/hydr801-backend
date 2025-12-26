const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GHL_API = 'https://rest.gohighlevel.com/v1';
const getToken = (req) => req.headers['x-ghl-token'] || 'pit-55a12918-f4a9-47d3-a3fc-d7638802782e';

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/ghl/contacts', async (req, res) => {
    try {
        const r = await fetch(`${GHL_API}/contacts?limit=${req.query.limit||20}&query=${req.query.query||''}`, {
            headers: { 'Authorization': 'Bearer ' + getToken(req) }
        });
        res.json(await r.json());
    } catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/ghl/contacts', async (req, res) => {
    try {
        const r = await fetch(`${GHL_API}/contacts`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken(req), 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        res.json(await r.json());
    } catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/ghl/contacts/:id/notes', async (req, res) => {
    try {
        const r = await fetch(`${GHL_API}/contacts/${req.params.id}/notes`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken(req), 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        res.json(await r.json());
    } catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/ghl/contacts/:id/tags', async (req, res) => {
    try {
        const r = await fetch(`${GHL_API}/contacts/${req.params.id}/tags`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken(req), 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        res.json(await r.json());
    } catch(e) { res.status(500).json({error: e.message}); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
