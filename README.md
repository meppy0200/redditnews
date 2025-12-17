# Reddit r/news Veri Seti Analiz Projesi

## Proje Hakkında

Bu proje, 2008-2024 yılları arasındaki Reddit r/news subreddit verilerini kullanarak kapsamlı bir veri bilimi analizi gerçekleştirmektedir. "Veri Bilimine Giriş" dersi için hazırlanmıştır.

## Analiz Konuları

- **Temel İstatistikler**: Gönderi sayıları, upvote/downvote oranları
- **Zaman Serisi Analizi**: Yıllara göre trendler, mevsimsel paternler
- **Metin Analizi**: Kelime bulutu, popüler konular, başlık analizi
- **Etkileşim Analizi**: En popüler gönderiler, viral içerik özellikleri
- **Görselleştirme**: Grafikler ve interaktif görseller

## Kurulum

### 1. Gerekli Kütüphaneleri Yükleyin

```bash
pip install -r requirements.txt
```

### 2. Veri Setini İndirin

```bash
python3 download_data.py
```

**Not**: Kaggle API anahtarınızın yapılandırılmış olması gerekir. Detaylar için [Kaggle API Dokümantasyonu](https://github.com/Kaggle/kaggle-api#api-credentials)'na bakın.

### 3. Jupyter Notebook'u Başlatın

```bash
jupyter notebook reddit_news_analysis.ipynb
```

## Proje Yapısı

```
.
├── README.md                      # Bu dosya
├── requirements.txt               # Python bağımlılıkları
├── download_data.py              # Veri indirme scripti
└── reddit_news_analysis.ipynb    # Ana analiz notebook'u
```

## Beklenen Çıktılar

- Zaman serisi grafikleri
- Kelime bulutları
- İstatistiksel analizler
- Trend raporları
- Görselleştirilmiş bulgular

## Kullanılan Teknolojiler

- **Python 3.x**
- **Pandas**: Veri manipülasyonu
- **NumPy**: Sayısal işlemler
- **Matplotlib & Seaborn**: Görselleştirme
- **WordCloud**: Kelime bulutu
- **NLTK**: Metin işleme
- **Jupyter**: İnteraktif analiz ortamı

## Lisans

Bu proje eğitim amaçlıdır.

## Yazar

Veri Bilimine Giriş Dersi J Grubu Öğrencileri / OSTIM 
