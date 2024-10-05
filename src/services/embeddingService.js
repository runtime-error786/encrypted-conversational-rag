const { OpenAIEmbeddings } = require('@langchain/openai');
require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');

function chunkTexts(text, chunkSize = 1000, overlapSize = 200) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        const chunk = text.slice(start, end);
        chunks.push(chunk);
        start += chunkSize - overlapSize;
    }

    return chunks;
}

async function embedTexts(textChunks) {
    console.log('API Key:', process.env.OPENAI_API_KE);
    const embedder = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KE,
        batchSize: 512,
        model: 'text-embedding-3-large',
    });

    const embeddingsDataArr = [];

    for (const chunk of textChunks) {
        const embedding = await embedder.embedQuery(chunk);
        embeddingsDataArr.push({
            embedding,
            chunk,
        });
    }

    return embeddingsDataArr;
}

async function generateAnswer(query, retrievedChunks) {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini", 
      openAIApiKey: process.env.OPENAI_API_KE
    });
    
  
    const context = retrievedChunks.join(' ');
    const systemMessage = `You are an AI that answers questions strictly based on the provided context. If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;
    const humanMessage = `Context: ${context}\n\nQuestion: ${query}`;
  
    const aiMsg = await llm.invoke([
      ["system", systemMessage],
      ["human", humanMessage],
    ]);
  
    return aiMsg.content.trim();
  }
  
module.exports = { chunkTexts, embedTexts,generateAnswer };
