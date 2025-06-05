const express = require('express');
const { createIngestion, getStatus } = require('./statusStore');

const app = express();
app.use(express.json());

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  const ingestionId = createIngestion(ids, priority);
  console.log("Created ingestionId:", ingestionId);
  res.json({ ingestion_id: ingestionId });
});

app.get('/status/:id', (req, res) => {
  const id = req.params.id;
  console.log("Received status request for id:", id);
  const status = getStatus(id);
  if (!status) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(status);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
