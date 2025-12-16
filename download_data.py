#!/usr/bin/env python3
"""
Reddit r/news Veri Seti İndirme Scripti
Bu script Kaggle'dan Reddit r/news veri setini indirir.
"""

import kagglehub
import os

def download_dataset():
    """Kaggle'dan veri setini indir"""
    print("Veri seti indiriliyor...")
    print("Bu işlem biraz zaman alabilir...")
    
    try:
        # Veri setini indir
        path = kagglehub.dataset_download("bwandowando/reddit-rnews-subreddit-2008-to-2024")
        
        print(f"\n✓ Veri seti başarıyla indirildi!")
        print(f"📁 Veri seti konumu: {path}")
        
        # İndirilen dosyaları listele
        print("\n📄 İndirilen dosyalar:")
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path) / (1024 * 1024)  # MB cinsinden
                print(f"  - {file} ({file_size:.2f} MB)")
        
        return path
        
    except Exception as e:
        print(f"\n✗ Hata oluştu: {e}")
        print("\nLütfen Kaggle API anahtarınızın doğru yapılandırıldığından emin olun.")
        print("Detaylar için: https://github.com/Kaggle/kaggle-api#api-credentials")
        return None

if __name__ == "__main__":
    dataset_path = download_dataset()
    
    if dataset_path:
        print("\n" + "="*60)
        print("Veri seti hazır! Şimdi analiz için Jupyter notebook'u açabilirsiniz:")
        print("  jupyter notebook reddit_news_analysis.ipynb")
        print("="*60)
