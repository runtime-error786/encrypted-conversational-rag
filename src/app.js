const express = require('express');
const { startServer } = require('./server');

const chatController = require('./controllers/chatController');
const pdfController = require('./controllers/pdfController');
const indexService = require('./services/indexService');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());  

app.post('/upload-pdf', pdfController.uploadPDF);
app.post('/query', chatController.postQuery);
app.get('/chat', chatController.getChat);
app.post('/create-index', indexService.createIndex);
app.get('/check-index', indexService.checkIndexExists);

const PORT = require('./config').PORT;

startServer(app, PORT);

