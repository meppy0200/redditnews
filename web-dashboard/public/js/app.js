/**
 * Ana uygulama logic - Bootstrap UI için güncellenmiş
 */

const API_BASE = window.location.origin + '/api';

// Global state
let yearlyData = null;
let eventsData = null;
let summaryData = null;
let wordsData = null;

/**
 * API'den veri çeker
 */
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Özet istatistikleri günceller
 */
function updateSummaryStats(data) {
  document.getElementById('total-posts').textContent = data.totalPosts.toLocaleString();
  document.getElementById('year-range').textContent = `${data.dateRange.start}-${data.dateRange.end}`;
  document.getElementById('avg-score').textContent = parseFloat(data.avgScore).toFixed(1);
  document.getElementById('avg-comments').textContent = parseFloat(data.avgComments).toFixed(1);
}

/**
 * Büyük olaylar kartlarını oluşturur
 */
function renderEvents(events) {
  const container = document.getElementById('events-container');
  if (!container) return;

  const eventClasses = ['crisis', 'spring', 'election', 'covid', 'war'];
  const eventIcons = ['bi-graph-down', 'bi-megaphone', 'bi-flag', 'bi-virus', 'bi-shield-exclamation'];
  const eventColors = ['danger', 'warning', 'primary', 'success', 'purple'];

  container.innerHTML = events.map((event, index) => `
    <div class="col-lg-6">
      <div class="card event-card ${eventClasses[index]} shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <i class="bi ${eventIcons[index]} fs-2 text-${eventColors[index]} me-3"></i>
            <div>
              <h5 class="card-title mb-1">${event.name}</h5>
              <p class="text-muted mb-0">
                <i class="bi bi-calendar3"></i> ${event.period}
              </p>
            </div>
          </div>
          
          <div class="event-stats">
            <div class="event-stat">
              <span class="text-muted">İlgili Gönderi</span>
              <strong>${event.stats.totalPosts.toLocaleString()}</strong>
            </div>
            <div class="event-stat">
              <span class="text-muted">Ortalama Score</span>
              <strong>${event.stats.avgScore.toFixed(1)}</strong>
            </div>
            <div class="event-stat">
              <span class="text-muted">Ortalama Yorum</span>
              <strong>${event.stats.avgComments.toFixed(1)}</strong>
            </div>
            <div class="event-stat">
              <span class="text-muted">Dönem İçinde</span>
              <strong>${event.stats.percentageOfPeriod.toFixed(1)}%</strong>
            </div>
          </div>
          
          <div class="mt-3">
            ${event.topKeywords.map(keyword =>
    `<span class="badge bg-secondary me-1">${keyword}</span>`
  ).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * En popüler gönderileri render eder
 */
function renderTopPosts(posts) {
  const container = document.getElementById('top-posts-container');
  if (!container) return;

  container.innerHTML = posts.map((post, index) => `
    <div class="card post-card shadow-sm mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="post-rank">#${index + 1}</div>
          </div>
          <div class="col">
            <h5 class="card-title mb-2">${post.title}</h5>
            <div class="post-meta d-flex flex-wrap gap-2">
              <span class="badge bg-primary">
                <i class="bi bi-star-fill"></i> ${post.score.toLocaleString()} score
              </span>
              <span class="badge bg-info">
                <i class="bi bi-chat-dots-fill"></i> ${post.comments.toLocaleString()} yorum
              </span>
              <span class="badge bg-secondary">
                <i class="bi bi-calendar-event"></i> ${post.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Tüm verileri yükler ve grafikleri oluşturur
 */
async function loadAllData() {
  const loadingScreen = document.getElementById('loading-screen');

  try {
    console.log('Fetching data from API...');

    // Paralel olarak tüm verileri çek
    const [yearly, events, summary, words] = await Promise.all([
      fetchData('/yearly-stats'),
      fetchData('/major-events'),
      fetchData('/summary'),
      fetchData('/top-words?limit=50')
    ]);

    // Global state'e kaydet
    yearlyData = yearly;
    eventsData = events;
    summaryData = summary;
    wordsData = words;

    console.log('Data loaded successfully');

    // UI'ı güncelle
    updateSummaryStats(summary);
    renderEvents(events);
    renderTopPosts(summary.topPosts);

    // Grafikleri oluştur
    createYearlyPostsChart(yearly);
    createAvgScoreChart(yearly);
    createAvgCommentsChart(yearly);
    createTopWordsChart(words);

    // Loading screen'i gizle
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 500);

  } catch (error) {
    console.error('Error loading data:', error);
    loadingScreen.innerHTML = `
      <div class="text-center text-white">
        <i class="bi bi-exclamation-triangle-fill fs-1 text-danger mb-3"></i>
        <h2>Veri Yüklenirken Hata Oluştu</h2>
        <p class="text-muted">${error.message}</p>
        <button class="btn btn-primary mt-3" onclick="location.reload()">
          <i class="bi bi-arrow-clockwise"></i> Yeniden Dene
        </button>
      </div>
    `;
  }
}

/**
 * Sayfa yüklendiğinde çalışır
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initialized');
  loadAllData();

  // Smooth scroll for navbar links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
