const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Veronica Converter - Video to MP3',
        error: null,
        success: null
    });
});

app.get('/convert', (req, res) => {
    res.render('convert', {
        title: 'Convert Video - Veronica Converter',
        filename: null,
        error: null
    });
});

// API Routes
app.use('/api', require('./api/upload'));
app.use('/api', require('./api/convert'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('index', {
        title: 'Page Not Found - Veronica Converter',
        error: 'Page not found',
        success: null
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('index', {
        title: 'Error - Veronica Converter',
        error: 'Something went wrong!',
        success: null
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});