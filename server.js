const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const app = express();
const PORT = process.env.PORT || 3000;

// Create necessary directories
const directories = ['uploads', 'converted', 'public/css', 'public/js'];
directories.forEach(dir => {
    fs.ensureDirSync(dir);
});

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files - IMPORTANT: This must come before routes
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data
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
    const filename = req.query.file;
    res.render('convert', {
        title: 'Convert Video - Veronica Converter',
        filename: filename || null,
        error: null
    });
});

// Simple upload endpoint for demo (no actual processing)
app.post('/api/upload', (req, res) => {
    // Simulate file processing
    setTimeout(() => {
        const filename = `converted-${Date.now()}.mp3`;
        res.json({
            success: true,
            filename: filename,
            downloadUrl: `/api/download/${filename}`
        });
    }, 2000);
});

// Simple download endpoint for demo
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // For demo purposes, send a dummy file
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    
    // Send a small dummy MP3 file or redirect
    res.redirect('/convert?file=' + encodeURIComponent(filename));
});

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
    console.log(`CSS should be available at http://localhost:${PORT}/css/style.css`);
});
