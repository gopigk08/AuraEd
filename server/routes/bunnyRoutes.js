const express = require('express');
const router = express.Router();

router.post('/videos', async (req, res) => {
    try {
        const { apiKey, libraryId, collectionId } = req.body;

        if (!apiKey || !libraryId) {
            return res.status(400).json({ message: 'Missing API Key or Library ID' });
        }

        const url = `https://video.bunnycdn.com/library/${libraryId}/videos${collectionId ? `?collection=${collectionId}` : ''}`;

        const response = await fetch(url, {
            headers: {
                AccessKey: apiKey,
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        if (data.items && data.items.length > 0) {
            console.log('Bunny Video First Item:', data.items[0]);
        }

        res.json(data);
    } catch (error) {
        console.error('Bunny API Error:', error.message);
        res.status(500).json({
            message: 'Failed to fetch videos from Bunny.net',
            details: error.message
        });
    }
});

router.post('/video-details', async (req, res) => {
    try {
        const { apiKey, libraryId, videoId } = req.body;

        if (!apiKey || !libraryId || !videoId) {
            return res.status(400).json({ message: 'Missing API Key, Library ID, or Video ID' });
        }

        const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

        const response = await fetch(url, {
            headers: {
                AccessKey: apiKey,
                Accept: 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        // Return only relevant details
        res.json({
            guid: data.guid,
            title: data.title,
            length: data.length, // Seconds
            thumbnailFileName: data.thumbnailFileName
        });
    } catch (error) {
        console.error('Bunny API Error (Details):', error.message);
        res.status(500).json({
            message: 'Failed to fetch video details',
            details: error.message
        });
    }
});

module.exports = router;
