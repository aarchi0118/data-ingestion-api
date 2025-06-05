const {
  getNextBatch
} = require('./queue');
const {
  markBatchTriggered,
  markBatchCompleted
} = require('./statusStore');

function processBatch({ ingestionId, batchId, ids }) {
  return new Promise((resolve) => {
    markBatchTriggered(ingestionId, batchId);
    setTimeout(() => {
      console.log(`Processed:`, ids);
      markBatchCompleted(ingestionId, batchId);
      resolve();
    }, 1000 * ids.length); // Simulate external API delay (1s per id)
  });
}

async function batchProcessor() {
  while (true) {
    const next = getNextBatch();
    if (next) {
      const ingestion = require('./statusStore').getStatus(next.ingestionId);
      for (const batch of ingestion.batches) {
        if (batch.status === 'yet_to_start') {
          await processBatch({ ingestionId: next.ingestionId, batchId: batch.batchId, ids: batch.ids });
          break;
        }
      }
    }
    await new Promise(r => setTimeout(r, 5000)); // rate limit: 1 batch / 5s
  }
}

module.exports = batchProcessor;
