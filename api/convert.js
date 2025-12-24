const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');

// Convert video to MP3
router.post('/convert', async (req, res) => {
    try {
        const { filename, quality } = req.body;
        
        if (!filename) {
            return res.status(400).json({
                success: false,
                error: 'Filename is required'
            });
        }

        const inputPath = path.join(__dirname, '../uploads', filename);
        const outputFilename = filename.replace(/\.[^/.]+$/, "") + '.mp3';
        const outputPath = path.join(__dirname, '../converted', outputFilename);

        // Ensure directories exist
        await fs.ensureDir(path.join(__dirname, '../converted'));

        // Set quality bitrate
        let bitrate = '192k';
        if (quality === 'high') bitrate = '320k';
        if (quality === 'low') bitrate = '128k';

        // Convert video to MP3 using ffmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioBitrate(bitrate)
                .audioCodec('libmp3lame')
                .format('mp3')
                .on('end', () => {
                    console.log('Conversion finished');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Conversion error:', err);
                    reject(err);
                })
                .save(outputPath);
        });

        // Delete original upload after conversion
        await fs.remove(inputPath);

        res.json({
            success: true,
            filename: outputFilename,
            downloadUrl: `/api/download/${outputFilename}`
        });

    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Download converted file
router.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../converted', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                // Try to delete the file after download
                setTimeout(() => {
                    fs.remove(filePath).catch(console.error);
                }, 5000);
            } else {
                // Delete file after successful download
                setTimeout(() => {
                    fs.remove(filePath).catch(console.error);
                }, 5000);
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error downloading file');
    }
});

module.exports = router;