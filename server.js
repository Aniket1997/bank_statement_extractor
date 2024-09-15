const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/upload', upload.single('pdf'), (req, res) => {
    const pdfPath = req.file.path;
    const originalName = req.file.originalname;
    const csvName = path.basename(originalName, path.extname(originalName)) + '.csv';
    const outputPath = path.join(__dirname, 'uploads', csvName);

    // Call the Python script to convert PDF to CSV
    const python = spawn('python', ['app.py', pdfPath, outputPath]);

    python.on('close', (code) => {
        if (code === 0) {
            res.download(outputPath, csvName, (err) => {
                if (err) {
                    console.log('Error in downloading file:', err);
                }

                // Clean up files
                fs.unlinkSync(pdfPath);
                fs.unlinkSync(outputPath);
            });
        } else {
            res.status(500).send('Error in converting PDF to CSV.');
        }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
