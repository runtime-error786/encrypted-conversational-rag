const { getDB } = require('../services/mongoService');
const { encrypt, decrypt } = require('../services/encryptionService');
const { retrieveRelevantChunks } = require('../services/indexService');
const { generateAnswer } = require('../services/embeddingService'); 

async function postQuery(req, res) {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const { encryptedData: encryptedQuery, iv: queryIv } = encrypt(query);

        const retrievedChunks = await retrieveRelevantChunks(query);
        const answer = await generateAnswer(query, retrievedChunks);

        const { encryptedData: encryptedAnswer, iv: answerIv } = encrypt(answer);

        await getDB().collection('chat').insertOne({
            encryptedQuery,
            queryIv,
            encryptedAnswer,
            answerIv,
            timestamp: new Date(),
        });

        res.status(200).json({ answer });
    } catch (error) {
        console.error('Error handling query:', error);
        res.status(500).json({ error: 'Failed to retrieve information.' });
    }
}

async function getChat(req, res) {
    try {
        const chatMessages = await getDB().collection('chat').find().toArray();
        const decryptedMessages = chatMessages.map((msg) => ({
            query: decrypt(msg.encryptedQuery, msg.queryIv),
            answer: decrypt(msg.encryptedAnswer, msg.answerIv),
            timestamp: msg.timestamp,
        }));
        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error('Error retrieving chat messages:', error);
        res.status(500).json({ error: 'Failed to retrieve chat messages.' });
    }
}

module.exports = { postQuery, getChat };
