const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});