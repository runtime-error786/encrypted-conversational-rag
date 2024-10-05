const { Pinecone } = require('@pinecone-database/pinecone');
const { chunkTexts, embedTexts } = require('./embeddingService');
const { getDB } = require('./mongoService');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const DB_INDEX = 'rag';
const NAMESPACE = 'test-namespace';

const createIndex = async (req, res) => {
    try {
      await pc.createIndex({
        name: process.env.DB_INDEX, 
        dimension: 3072,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });
      res.status(200).json({ message: 'Index created successfully' }); 
    } catch (error) {
      console.error('Error creating index:', error);
      res.status(500).json({ error: 'Failed to create index' }); 
    }
  };
  
  const checkIndexExists = async (req, res) => {
    try {
      const response = await pc.listIndexes();
      const indexFound = response.indexes.find((item) => item.name === DB_INDEX);
  
      if (indexFound) {
        res.status(200).json({ message: `Index '${DB_INDEX}' exists.` });
      } else {
        res.status(404).json({ message: `Index '${DB_INDEX}' not found.` });
      }
    } catch (error) {
      console.error('Error checking index:', error);
      res.status(500).json({ error: 'Failed to check index.' });
    }
  };
  

async function storeEmbeddings(embeddings, namespace = NAMESPACE) {
    const index = pc.index(DB_INDEX);

    for (let i = 0; i < embeddings.length; i++) {
        await index.namespace(namespace).upsert([{
            id: `chunk-${i}`,
            values: embeddings[i].embedding,
            metadata: { chunk: embeddings[i].chunk },
        }]);
    }
}

async function retrieveRelevantChunks(query, namespace = NAMESPACE) {
    const embeddingDataArr = await embedTexts([query]);
    const index = pc.index(DB_INDEX);
    const results = await index.namespace(namespace).query({
        vector: embeddingDataArr[0].embedding,
        topK: 5,
        includeValues: true,
        includeMetadata: true,
    });
    return results.matches.map((match) => match.metadata.chunk);
}

module.exports = {
    createIndex,
    checkIndexExists,
    storeEmbeddings,
    retrieveRelevantChunks,
};
