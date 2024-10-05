const { extractTextsFromPDF } = require('../services/pdfService');
const { chunkTexts } = require('../services/embeddingService');
const { storeEmbeddings } = require('../services/indexService');
const {embedTexts} = require("../services/embeddingService")
async function uploadPDF(req, res) {
    const { filePath } = req.body;

    try {
        const pdfText = await extractTextsFromPDF(filePath);
        const chunks = chunkTexts(pdfText);
        const embeddings = await embedTexts(chunks);

        await storeEmbeddings(embeddings);

        res.status(200).json({ message: 'PDF processed and embeddings stored successfully.' });
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF.' });
    }
}

module.exports = { uploadPDF };
