const path = require('path');
const fs = require('fs');

// JSON veri dosyası konumu
const JSON_DATA_PATH = path.join(__dirname, '..', 'data', 'processed_data.json');

// Cache için
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 30; // 30 dakika

/**
 * JSON dosyasından veriyi yükler
 */
function loadJSONData() {
    console.log('Loading data from JSON file...');

    if (!fs.existsSync(JSON_DATA_PATH)) {
        console.error(`JSON data file not found: ${JSON_DATA_PATH}`);
        console.log('Please run: python3 process_data.py');
        return null;
    }

    try {
        const rawData = fs.readFileSync(JSON_DATA_PATH, 'utf8');
        const data = JSON.parse(rawData);
        console.log('✓ Data loaded successfully from JSON');
        return data;
    } catch (error) {
        console.error('Error reading JSON file:', error.message);
        return null;
    }
}

/**
 * Veriyi işler ve cache'e alır
 */
async function processData() {
    // Cache kontrolü
    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        console.log('Returning cached data');
        return cachedData;
    }

    console.log('Loading fresh data...');
    const data = loadJSONData();

    if (!data) {
        // Boş veri döndür
        return {
            yearlyStats: { years: [], postCounts: [], avgScores: [], avgComments: [] },
            majorEvents: [],
            summary: { totalPosts: 0, avgScore: '0', avgComments: '0', dateRange: { start: 2008, end: 2024 }, topPosts: [] },
            topWords: { words: [], frequencies: [] }
        };
    }

    // Cache'e al
    cachedData = data;
    cacheTimestamp = Date.now();

    return data;
}

/**
 * Yıllık istatistikleri hesaplar
 */
async function getYearlyStats() {
    const data = await processData();
    return data.yearlyStats || { years: [], postCounts: [], avgScores: [], avgComments: [] };
}

/**
 * Büyük olaylar analizi
 */
async function getMajorEventsAnalysis() {
    const data = await processData();
    return data.majorEvents || [];
}

/**
 * Genel özet istatistikleri
 */
async function getSummaryStats() {
    const data = await processData();
    return data.summary || { totalPosts: 0, avgScore: '0', avgComments: '0', dateRange: { start: 2008, end: 2024 }, topPosts: [] };
}

/**
 * En popüler kelimeleri bulur
 */
async function getTopWords(limit = 50) {
    const data = await processData();
    const words = data.topWords || { words: [], frequencies: [] };

    // Limit uygula
    return {
        words: words.words.slice(0, limit),
        frequencies: words.frequencies.slice(0, limit)
    };
}

module.exports = {
    getYearlyStats,
    getMajorEventsAnalysis,
    getSummaryStats,
    getTopWords,
    processData
};
