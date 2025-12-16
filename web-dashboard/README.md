# Reddit r/news Interactive Dashboard

🚀 **Express.js tabanlı interaktif veri görselleştirme web uygulaması**

Reddit r/news subreddit'inin 2008-2024 yılları arasındaki verilerini analiz eden ve görselleştiren modern web dashboard'u.

## ✨ Özellikler

### 📊 Veri Analizleri
- **Yıllık Trendler**: Gönderi sayısı, ortalama score ve yorum istatistikleri
- **Büyük Olaylar Analizi**: 
  - 2008 Finans Krizi
  - 2011 Arap Baharı
  - 2016 ABD Seçimleri
  - 2020 COVID-19 Pandemisi
  - 2022-2023 Ukrayna Savaşı
- **Metin Analizi**: En popüler kelimeler ve kullanım frekansları
- **Top Posts**: Tüm zamanların en popüler gönderileri

### 🎨 Tasarım
- Modern glassmorphism efektleri
- Dark mode gradient background
- Smooth animations ve transitions
- Responsive tasarım (mobil uyumlu)
- Chart.js ile interaktif grafikler

### ⚡ Performans
- Parquet dosya formatı desteği
- Veri cache mekanizması
- Compression middleware
- Optimize edilmiş API endpoints

## 🛠️ Teknoloji Stack

### Backend
- **Express.js** - Web server
- **ParquetJS** - Parquet dosya okuma
- **CORS** - Cross-origin support
- **Compression** - Gzip compression

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling
- **Vanilla JavaScript** - Client-side logic
- **Chart.js** - Data visualization

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd web-dashboard
npm install
```

### 2. Veri Setini Hazırlayın

Veri seti zaten indirilmiş durumda:
```
/root/.cache/kagglehub/datasets/bwandowando/reddit-rnews-subreddit-2008-to-2024/versions/2
```

### 3. Server'ı Başlatın

```bash
npm start
```

Veya development modunda (auto-restart):
```bash
npm run dev
```

### 4. Dashboard'a Erişin

Tarayıcınızda açın:
```
http://localhost:3000
```

## 📡 API Endpoints

### GET /api/yearly-stats
Yıllara göre istatistikler

**Response:**
```json
{
  "years": [2008, 2009, ...],
  "postCounts": [1234, 5678, ...],
  "avgScores": [45.2, 52.1, ...],
  "avgComments": [12.3, 15.7, ...]
}
```

### GET /api/major-events
Büyük olaylar analizi

**Response:**
```json
[
  {
    "name": "2008 Financial Crisis",
    "period": "2008-2009",
    "stats": {
      "totalPosts": 1234,
      "avgScore": 67.8,
      "avgComments": 23.4,
      "percentageOfPeriod": 15.2
    },
    "topKeywords": ["economy", "crisis", "bailout"]
  }
]
```

### GET /api/summary
Genel özet istatistikleri

**Response:**
```json
{
  "totalPosts": 123456,
  "avgScore": "45.67",
  "avgComments": "12.34",
  "dateRange": {
    "start": 2008,
    "end": 2024
  },
  "topPosts": [...]
}
```

### GET /api/top-words?limit=50
En popüler kelimeler

**Query Parameters:**
- `limit` (optional): Kaç kelime döndürülecek (default: 50)

**Response:**
```json
{
  "words": ["trump", "police", "court", ...],
  "frequencies": [12345, 9876, 8765, ...]
}
```

### GET /api/health
Health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-16T19:00:00.000Z"
}
```

## 📁 Proje Yapısı

```
web-dashboard/
├── server.js              # Express.js server
├── package.json           # Node.js dependencies
├── api/
│   ├── data-processor.js  # Veri işleme fonksiyonları
│   └── routes.js          # API endpoints
└── public/
    ├── index.html         # Ana HTML
    ├── css/
    │   └── style.css      # Styling
    └── js/
        ├── app.js         # Ana uygulama logic
        └── charts.js      # Chart.js yapılandırmaları
```

## 🎯 Kullanım Senaryoları

### Veri Bilimi Projesi
Bu dashboard, "Veri Bilimine Giriş" dersi için mükemmel bir proje örneğidir:
- Gerçek dünya veri seti
- API tasarımı ve implementasyonu
- Veri görselleştirme
- Web development best practices

### Analiz Örnekleri
1. **Trend Analizi**: Yıllar içinde haber yoğunluğunun değişimi
2. **Olay Etkisi**: Büyük olayların sosyal medya üzerindeki etkisi
3. **Metin Madenciliği**: Popüler konular ve kelime kullanımı
4. **Etkileşim Paternleri**: Score ve yorum korelasyonları

## 🔧 Geliştirme

### Environment Variables

```bash
# .env dosyası oluşturun
PORT=3000
DATA_PATH=/root/.cache/kagglehub/datasets/bwandowando/reddit-rnews-subreddit-2008-to-2024/versions/2
```

### Debug Mode

```bash
# Detaylı loglar için
DEBUG=* npm start
```

## 📊 Performans Notları

- **İlk Yükleme**: Parquet dosyaları ilk kez okunduğunda ~10-30 saniye sürebilir
- **Cache**: Veriler 30 dakika boyunca cache'de tutulur
- **Memory**: Büyük veri seti nedeniyle ~2GB RAM kullanımı beklenir

## 🚀 Production Deployment

### PM2 ile Deployment

```bash
npm install -g pm2
pm2 start server.js --name reddit-dashboard
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 Lisans

MIT License - Eğitim amaçlı proje

## 👤 Yazar

Veri Bilimine Giriş Dersi Projesi

## 🙏 Teşekkürler

- Veri Kaynağı: [Kaggle - Reddit r/news Dataset](https://www.kaggle.com/datasets/bwandowando/reddit-rnews-subreddit-2008-to-2024)
- Chart.js: [https://www.chartjs.org/](https://www.chartjs.org/)
- Express.js: [https://expressjs.com/](https://expressjs.com/)
