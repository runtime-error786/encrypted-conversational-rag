const startServer = (app, PORT) => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

module.exports = { startServer };
