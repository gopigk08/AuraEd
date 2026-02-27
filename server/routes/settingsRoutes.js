const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const m3u8Parser = require('m3u8-parser');

// Admin Middleware Check
const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ uid: req.user.uid });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error during admin verification" });
    }
};

// @desc    Get a setting by key
// @route   GET /api/settings/:key
// @access  Public
router.get('/:key', async (req, res) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });
        if (setting) {
            res.json(setting);
        } else {
            // Return a default object if not found, rather than 404, to simplify frontend logic
            res.json({ key: req.params.key, value: null });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create or update a setting
// @route   POST /api/settings
// @access  Private/Admin
router.post('/', verifyToken, checkAdmin, async (req, res) => {
    const { key, value } = req.body;

    try {
        let setting = await Settings.findOne({ key });

        if (setting) {
            setting.value = value;
            setting.updatedAt = Date.now();
            await setting.save();
        } else {
            setting = new Settings({
                key,
                value
            });
            await setting.save();
        }

        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch and parse an m3u8 file to get total duration
// @route   POST /api/settings/m3u8-duration
// @access  Private/Admin
router.post('/m3u8-duration', verifyToken, checkAdmin, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || !url.includes('.m3u8')) {
            return res.status(400).json({ message: 'Valid m3u8 URL is required' });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch m3u8: ${response.statusText}`);
        }

        const manifestText = await response.text();
        const parser = new m3u8Parser.Parser();
        parser.push(manifestText);
        parser.end();

        const parsedManifest = parser.manifest;
        let totalDuration = 0;

        if (parsedManifest.segments && parsedManifest.segments.length > 0) {
            // Standard VOD m3u8 where segments have #EXTINF duration
            totalDuration = parsedManifest.segments.reduce((acc, segment) => acc + (segment.duration || 0), 0);
        } else if (parsedManifest.playlists && parsedManifest.playlists.length > 0) {
            // Master playlist: Recursively fetch the highest quality stream to get duration
            const highestQualityStream = parsedManifest.playlists.sort((a, b) => (b.attributes.BANDWIDTH || 0) - (a.attributes.BANDWIDTH || 0))[0];
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

            // Construct full URL if the URI is relative
            let streamUrl = highestQualityStream.uri;
            if (!streamUrl.startsWith('http')) {
                streamUrl = baseUrl + streamUrl;
            }

            const streamResponse = await fetch(streamUrl);
            const streamText = await streamResponse.text();

            const subParser = new m3u8Parser.Parser();
            subParser.push(streamText);
            subParser.end();

            if (subParser.manifest.segments) {
                totalDuration = subParser.manifest.segments.reduce((acc, segment) => acc + (segment.duration || 0), 0);
            }
        }

        res.json({ length: totalDuration });

    } catch (error) {
        console.error('m3u8 Fetch Error:', error);
        res.status(500).json({ message: 'Failed to process m3u8 file', error: error.message });
    }
});

module.exports = router;
