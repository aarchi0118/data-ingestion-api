const queues = {
  HIGH: [],
  MEDIUM: [],
  LOW: []
};

function enqueue(priority, ingestionId, ids) {
  queues[priority].push({ ingestionId, ids, createdAt: Date.now() });
}

function getNextBatch() {
  for (const p of ['HIGH', 'MEDIUM', 'LOW']) {
    if (queues[p].length > 0) {
      return queues[p].shift();
    }
  }
  return null;
}

module.exports = { enqueue, getNextBatch };
