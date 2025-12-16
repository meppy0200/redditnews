const express = require('express');
const router = express.Router();
const {
    getYearlyStats,
    getMajorEventsAnalysis,
    getSummaryStats,
    getTopWords
} = require('./data-processor');

/**
 * GET /api/yearly-stats
 * Yıllara göre istatistikler
 */
router.get('/yearly-stats', async (req, res) => {
    try {
        console.log('API: Fetching yearly stats...');
        const stats = await getYearlyStats();
        res.json(stats);
    } catch (error) {
        console.error('Error in /api/yearly-stats:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/major-events
 * Büyük olaylar analizi
 */
router.get('/major-events', async (req, res) => {
    try {
        console.log('API: Fetching major events analysis...');
        const events = await getMajorEventsAnalysis();
        res.json(events);
    } catch (error) {
        console.error('Error in /api/major-events:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/summary
 * Genel özet istatistikleri
 */
router.get('/summary', async (req, res) => {
    try {
        console.log('API: Fetching summary stats...');
        const summary = await getSummaryStats();
        res.json(summary);
    } catch (error) {
        console.error('Error in /api/summary:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/top-words
 * En popüler kelimeler
 */
router.get('/top-words', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        console.log(`API: Fetching top ${limit} words...`);
        const words = await getTopWords(limit);
        res.json(words);
    } catch (error) {
        console.error('Error in /api/top-words:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
