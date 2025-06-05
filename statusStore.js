// statusStore.js
const { v4: uuidv4 } = require('uuid');
const ingestions = new Map();

function createIngestion(ids, priority) {
  const ingestionId = uuidv4();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    batches.push({
      batchId: uuidv4(),
      ids: ids.slice(i, i + 3),
      status: 'yet_to_start'
    });
  }

  ingestions.set(ingestionId, {
    priority,
    createdAt: Date.now(),
    status: 'yet_to_start',
    batches
  });

  console.log(`Saved ingestionId ${ingestionId} in store`);
  return ingestionId;
}

function getStatus(ingestionId) {
  const ingestion = ingestions.get(ingestionId);
  if (!ingestion) {
    console.log(`Ingestion ID not found: ${ingestionId}`);
    return null;
  }

  const batchStatuses = ingestion.batches.map(b => b.status);
  ingestion.status = batchStatuses.every(s => s === 'yet_to_start')
    ? 'yet_to_start'
    : batchStatuses.every(s => s === 'completed')
    ? 'completed'
    : 'triggered';

  return { ingestion_id: ingestionId, status: ingestion.status, batches: ingestion.batches };
}

module.exports = { createIngestion, getStatus };
